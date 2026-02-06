import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-debug-utmify',
};

interface CustomerAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface Customer {
  name: string;
  cpf: string;
  phone: string;
  email?: string;
  address: CustomerAddress;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface BumpItem {
  id: string;
  name: string;
  price: number;
}

interface TrackingParameters {
  src?: string | null;
  sck?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  utm_medium?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
}

interface PaymentRequest {
  customer: Customer;
  product: ProductItem;
  shipping: {
    optionId: number;
    price: number;
  };
  bumps: BumpItem[];
  total: number;
  trackingParameters?: TrackingParameters;
}

function toDateTimeString(value?: string | number | Date | null): string | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().replace("T", " ").substring(0, 19);
}

function mapStatus(status?: string | null): string {
  const normalized = (status || "").toLowerCase();
  if (normalized === "pending" || normalized === "waiting_payment") {
    return "waiting_payment";
  }
  if (normalized === "completed" || normalized === "paid") {
    return "paid";
  }
  if (normalized === "refunded") {
    return "refunded";
  }
  if (normalized === "chargedback" || normalized === "chargeback") {
    return "chargedback";
  }
  return "refused";
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const debugUtmify = req.headers.get("x-debug-utmify") === "1";
    const secretKey = Deno.env.get('PAYEVO_SECRET_KEY');

    if (!secretKey) {
      throw new Error('PayEvo credentials not configured');
    }

    const payload: PaymentRequest = await req.json();

    // Create Base64 encoded auth (secret key only, as per PayEvo docs)
    const authString = btoa(secretKey);

    // Build items array for PayEvo
    const items: Array<{
      title: string;
      unitPrice: number;
      quantity: number;
      externalRef: string;
    }> = [];

    // Add main product
    items.push({
      title: payload.product.name,
      unitPrice: Math.round(payload.product.price * 100), // Convert to cents
      quantity: payload.product.quantity,
      externalRef: payload.product.id,
    });

    // Add bump items
    if (payload.bumps && payload.bumps.length > 0) {
      payload.bumps.forEach((bump) => {
        items.push({
          title: bump.name,
          unitPrice: Math.round(bump.price * 100), // Convert to cents
          quantity: 1,
          externalRef: bump.id,
        });
      });
    }

    // Add shipping as an item if not free
    if (payload.shipping.price > 0) {
      items.push({
        title: 'Frete',
        unitPrice: Math.round(payload.shipping.price * 100),
        quantity: 1,
        externalRef: `shipping-${payload.shipping.optionId}`,
      });
    }

    // Prepare PayEvo transaction payload according to their API structure
    const transactionPayload = {
      customer: {
        name: payload.customer.name,
        email: payload.customer.email?.trim() ||
          `${payload.customer.cpf.replace(/\D/g, '')}@cliente.temp`,
        phone: payload.customer.phone.replace(/\D/g, ''),
        document: {
          type: "CPF",
          number: payload.customer.cpf.replace(/\D/g, ''),
        },
      },
      paymentMethod: "PIX",
      pix: {
        expiresInDays: 1,
      },
      amount: Math.round(payload.total * 100), // Convert to cents
      items: items,
    };

    console.log('Sending payment request to PayEvo:', JSON.stringify(transactionPayload));

    const response = await fetch('https://apiv2.payevo.com.br/functions/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(transactionPayload),
    });

    const responseText = await response.text();
    console.log('PayEvo response status:', response.status);
    console.log('PayEvo response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`Invalid response from PayEvo: ${responseText}`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Payment processing failed');
    }

    // Return the PIX payment data
    const pixPayload = data.pix?.qrcode || data.pix?.payload || '';
    const qrCodeUrl = pixPayload 
      ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixPayload)}`
      : '';
    const orderId = data.id || `ORD-${Date.now()}`;

    // Persist payment + UTM data and send to Utmify (best effort)
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey =
      Deno.env.get("SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const trackingParameters = payload.trackingParameters || {};
    const customerCpf = payload.customer.cpf.replace(/\D/g, '');
    const customerPhone = payload.customer.phone.replace(/\D/g, '');
    const customerEmail =
      payload.customer.email?.trim() || `${customerCpf}@cliente.temp`;

    if (supabaseUrl && supabaseServiceRoleKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
      const { error: insertError } = await supabase
        .from("payments")
        .insert({
          identifier: orderId,
          product_name: payload.product.name,
          customer_name: payload.customer.name,
          customer_email: customerEmail,
          customer_cpf: customerCpf,
          customer_phone: customerPhone,
          amount: payload.total,
          final_amount: payload.total,
          pix_code: pixPayload,
          status: "pending",
          payment_method: "PIX",
          tracking_parameters: trackingParameters,
        });

      if (insertError) {
        console.error("Failed to insert payment:", insertError);
      }
    } else {
      console.warn(
        "SUPABASE_URL or SERVICE_ROLE_KEY not configured. Skipping payment persistence."
      );
    }

    const utmifyToken = Deno.env.get("UTMIFY_API_TOKEN");
    let utmifyDebug: { status: number; response: string } | null = null;
    if (utmifyToken) {
      const priceInCents = Math.round(payload.total * 100);
      const utmifyPlatform = Deno.env.get("UTMIFY_PLATFORM") || "CNH Social";
      const utmifyPayload = {
        orderId,
        platform: utmifyPlatform,
        paymentMethod: "pix",
        status: mapStatus(data.status || "pending"),
        createdAt: toDateTimeString(new Date()),
        approvedDate: null,
        refundedAt: null,
        customer: {
          name: payload.customer.name,
          email: customerEmail,
          phone: customerPhone || null,
          document: customerCpf,
          country: "BR",
        },
        products: [
          {
            id: orderId,
            name: payload.product.name || "Pagamento",
            planId: null,
            planName: null,
            quantity: 1,
            priceInCents,
          },
        ],
        trackingParameters: {
          src: trackingParameters.src || null,
          sck: trackingParameters.sck || null,
          utm_source: trackingParameters.utm_source || null,
          utm_campaign: trackingParameters.utm_campaign || null,
          utm_medium: trackingParameters.utm_medium || null,
          utm_content: trackingParameters.utm_content || null,
          utm_term: trackingParameters.utm_term || null,
        },
        commission: {
          totalPriceInCents: priceInCents,
          gatewayFeeInCents: 0,
          userCommissionInCents: priceInCents,
        },
        isTest: false,
      };

      const utmifyResponse = await fetch(
        "https://api.utmify.com.br/api-credentials/orders",
        {
          method: "POST",
          headers: {
            "x-api-token": utmifyToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(utmifyPayload),
        }
      );

      const utmifyText = await utmifyResponse.text();
      if (debugUtmify) {
        utmifyDebug = { status: utmifyResponse.status, response: utmifyText };
      }
      if (!utmifyResponse.ok) {
        console.error(
          "Utmify API error:",
          utmifyResponse.status,
          utmifyText
        );
      }
    } else {
      console.warn("UTMIFY_API_TOKEN not configured. Skipping Utmify.");
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        pixPayload: pixPayload,
        qrCodeUrl: qrCodeUrl,
        orderId: orderId,
        expiresAt: data.pix?.expirationDate,
        utmifyDebug: debugUtmify ? utmifyDebug : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao processar pagamento';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
