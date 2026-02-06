import { Product, Review } from "@/types/product";
import product1 from "@/assets/product-1.png";
import product2 from "@/assets/product-2.png";
import product3 from "@/assets/product-3.png";
import product4 from "@/assets/product-4.png";
import product5 from "@/assets/product-5.png";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import reviewImg1 from "@/assets/review-img-1.webp";
import reviewImg2 from "@/assets/review-img-2.webp";
import reviewImg3 from "@/assets/review-img-3.webp";
import reviewImg4 from "@/assets/review-img-4.webp";
import reviewImg5 from "@/assets/review-img-5.webp";

export const product: Product = {
  id: "prod_001",
  name: "Barbeador Elétrico A Prova D'água USB Flexível Profissional 100V/240V",
  description: "Aparador, barbeador e contornador 3 em 1. Tecnologia OneBlade exclusiva para raspar, aparar e contornar qualquer tamanho de barba. Resistente à água, recarregável via USB, bateria de longa duração com 45 minutos de uso.",
  price: 39.90,
  originalPrice: 129.90,
  discount: 69,
  images: [
    product1,
    product2,
    product3,
    product4,
    product5,
  ],
  rating: 4.9,
  reviewCount: 3842,
  soldCount: 18750,
};

export const reviews: Review[] = [
  {
    id: "1",
    author: "@rafa.beleza_",
    avatar: avatar1,
    rating: 5,
    date: "há 2 dias",
    comment: "Gente, esse barbeador é tudo!! Comprei pro meu marido e ele amou demais 🔥 Super prático e a qualidade é incrível pelo preço!",
    video: "/videos/review-video-1.mp4",
  },
  {
    id: "2",
    author: "@gui.tsx",
    avatar: avatar2,
    rating: 5,
    date: "há 3 dias",
    comment: "Produto excelente! Chegou muito bem embalado e funciona perfeitamente. A bateria dura bastante mesmo.",
    images: [reviewImg1, reviewImg2],
    video: "/videos/review-video-2.mp4",
  },
  {
    id: "3",
    author: "@diegao.oficial",
    avatar: avatar3,
    rating: 5,
    date: "há 5 dias",
    comment: "Uso no banho sem medo nenhum, resistente à água de verdade! Melhor custo-benefício que já comprei.",
    images: [reviewImg3, reviewImg4],
    video: "/videos/review-video-3.mp4",
  },
  {
    id: "4",
    author: "@matheus.sp23",
    avatar: avatar4,
    rating: 4,
    date: "há 1 semana",
    comment: "Ótimo produto pelo preço. Faz o trabalho direitinho, tanto pra barba quanto pro corpo. Recomendo!",
    images: [reviewImg5],
  },
];
