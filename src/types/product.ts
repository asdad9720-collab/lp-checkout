export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  video?: string;
}

export interface CheckoutData {
  fullName: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PaymentResponse {
  success: boolean;
  pixPayload?: string;
  qrCodeUrl?: string;
  orderId?: string;
  error?: string;
  orderItems?: OrderItem[];
  shippingPrice?: number;
  total?: number;
}
