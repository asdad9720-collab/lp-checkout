import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

type RequestPayload = {
  orderId?: string;
  status?: string;
};

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, status } = (await req.json()) as RequestPayload;
    if (!orderId) {
      throw new Error("orderId is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("identifier", orderId)
      .maybeSingle();

    if (error || !payment) {
      throw new Error("Payment not found");
    }

    const utmifyToken = Deno.env.get("UTMIFY_API_TOKEN");
    if (!utmifyToken) {
      throw new Error("UTMIFY_API_TOKEN not configured");
    }

    const amountValue = Number(payment.final_amount ?? payment.amount ?? 0);
    const priceInCents = Math.round(amountValue * 100);
    const tracking = (payment.tracking_parameters || {}) as Record<
      string,
      string | null
    >;

    const customerEmail =
      payment.customer_email || "contato@programacnh2026.site";
    const customerDocument = payment.customer_cpf || "00000000000";

    const utmifyPayload = {
      orderId: payment.identifier,
      platform: "CNH Social",
      paymentMethod: (payment.payment_method || "pix").toLowerCase(),
      status: mapStatus(status || payment.status),
      createdAt: toDateTimeString(payment.created_at),
      approvedDate: toDateTimeString(payment.paid_at),
      refundedAt: null,
      customer: {
        name: payment.customer_name,
        email: customerEmail,
        phone: payment.customer_phone || null,
        document: customerDocument,
        country: "BR",
      },
      products: [
        {
          id: payment.identifier,
          name: payment.product_name || "Pagamento",
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents,
        },
      ],
      trackingParameters: {
        src: tracking.src || null,
        sck: tracking.sck || null,
        utm_source: tracking.utm_source || null,
        utm_campaign: tracking.utm_campaign || null,
        utm_medium: tracking.utm_medium || null,
        utm_content: tracking.utm_content || null,
        utm_term: tracking.utm_term || null,
      },
      commission: {
        totalPriceInCents: priceInCents,
        gatewayFeeInCents: 0,
        userCommissionInCents: priceInCents,
      },
      isTest: false,
    };

    const response = await fetch(
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

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Utmify API error: ${response.status} - ${responseText}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Sent to Utmify successfully",
        utmifyResponse: responseText,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
