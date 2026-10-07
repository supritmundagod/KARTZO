export type ProductSummary = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageLink: string;
  category: string;
  averageRating: number;
  reviewCount: number;
};

export type Review = {
  id: number;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
};

export type ProductDetail = {
  product: ProductSummary;
  reviews: Review[];
  canReview: boolean;
};

export type PagedProducts = {
  content: ProductSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: string;
  direction: string;
};

export type CartLine = {
  cartItemId: number;
  product: ProductSummary;
  quantity: number;
  lineTotal: number;
};

export type Cart = {
  items: CartLine[];
  subTotal: number;
  empty: boolean;
};

export type CheckoutLine = {
  productName: string;
  imageLink: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CheckoutSession = {
  userName: string;
  userEmail: string;
  userContact: string;
  items: CheckoutLine[];
  subTotal: number;
  discountAmount: number;
  appliedCouponCode: string | null;
  total: number;
  currency: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
  mockMode: boolean;
};

export type MeSession = {
  name: string;
  email: string;
};

export type OrderSummary = {
  id: number;
  totalAmount: number;
  deliveryAddress: string;
  orderDate: string;
  status: string;
  paymentMethod?: string;
  trackingId?: string;
  courierPartner?: string;
  estimatedDeliveryDate?: string;
  lines: CheckoutLine[];
};

export type WishlistItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  imageLink: string;
  category: string;
};

export type FullProfile = {
  name: string;
  email: string;
  mobile: number;
};
