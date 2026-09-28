export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  unit_type: 'sachet' | 'packet' | 'carton';
  sachet_equivalent: number;
  price: number;
  compare_at_price: number | null;
  wholesale_price: number | null;
  is_active: boolean;
  display_order: number;
  created_at?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  how_to_prepare: string | null;
  features: Array<{ title: string; description: string }>;
  images: string[];
  is_active: boolean;
  display_order: number;
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
};

export type Inventory = {
  id: string;
  product_id: string;
  total_sachets_in_stock: number;
  low_stock_threshold: number;
  updated_at: string;
};

export type InventoryMovement = {
  id: string;
  product_id: string;
  order_id?: string | null;
  change_sachets: number;
  balance_after: number;
  reason: 'order_sale' | 'admin_restock' | 'damage_adjustment' | 'return_restock' | 'initial_seed';
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
};

export type DeliveryZone = {
  id: string;
  name: string;
  states: string[];
  fee: number;
  estimated_days: string;
  is_active: boolean;
};

export type OrderItem = {
  id?: string;
  order_id?: string;
  variant_id: string;
  variant_name: string;
  unit_price: number;
  quantity: number;
  sachet_equivalent: number;
  line_total: number;
};

export type Order = {
  id: string;
  order_number: string;
  access_token: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_whatsapp?: string | null;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_instructions?: string | null;
  delivery_zone_id?: string | null;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillment_status: 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  delivery_zones?: DeliveryZone;
};

export type Payment = {
  id: string;
  order_id: string;
  provider: 'nowpayments' | 'paystack' | 'manual_transfer';
  provider_payment_id?: string | null;
  payment_reference: string;
  pay_amount: number;
  pay_currency: string;
  status: 'created' | 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'finished' | 'failed' | 'expired' | 'refunded';
  raw_response?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type WholesaleEnquiry = {
  id: string;
  full_name: string;
  business_name: string;
  email: string;
  phone: string;
  whatsapp?: string | null;
  location: string;
  quantity_interested: string;
  message?: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'approved' | 'declined';
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  variantId: string;
  variantName: string;
  unitType: 'sachet' | 'packet' | 'carton';
  sachetEquivalent: number;
  unitPrice: number;
  quantity: number;
  image?: string;
};

export type SiteSettings = {
  brand_name: string;
  brand_tagline: string;
  company_name: string;
  company_abbreviation: string;
  support_email: string;
  contact_phone: string;
  whatsapp_number: string;
  currency_symbol: string;
  currency_code: string;
  announcement: string;
};
