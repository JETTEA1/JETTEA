-- ==============================================================================
-- JETTEA® E-Commerce Platform Database Migration
-- Target: Supabase PostgreSQL 17
-- Security: Row Level Security (RLS) enabled on all tables
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    whatsapp TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ADMIN USERS TABLE (Privileged roles)
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('super_admin', 'manager', 'fulfillment')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    );
$$;

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL DEFAULT 'FOR HEALTHY LIVING',
    description TEXT NOT NULL,
    how_to_prepare TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    unit_type TEXT NOT NULL CHECK (unit_type IN ('sachet', 'packet', 'carton')),
    sachet_equivalent INT NOT NULL CHECK (sachet_equivalent > 0),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(12, 2),
    wholesale_price NUMERIC(12, 2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. INVENTORY TABLE (Total shared stock in sachets)
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID UNIQUE NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    total_sachets_in_stock INT NOT NULL DEFAULT 0 CHECK (total_sachets_in_stock >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 1000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. INVENTORY MOVEMENTS (Audit trail for stock changes)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    order_id UUID,
    change_sachets INT NOT NULL,
    balance_after INT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('order_sale', 'admin_restock', 'damage_adjustment', 'return_restock', 'initial_seed')),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DELIVERY ZONES TABLE
CREATE TABLE IF NOT EXISTS public.delivery_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    states TEXT[] NOT NULL,
    fee NUMERIC(12, 2) NOT NULL CHECK (fee >= 0),
    estimated_days TEXT NOT NULL DEFAULT '2-4 business days',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    access_token UUID NOT NULL DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_whatsapp TEXT,
    delivery_address TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_state TEXT NOT NULL,
    delivery_instructions TEXT,
    delivery_zone_id UUID REFERENCES public.delivery_zones(id) ON DELETE SET NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.product_variants(id),
    variant_name TEXT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    sachet_equivalent INT NOT NULL CHECK (sachet_equivalent > 0),
    line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'nowpayments' CHECK (provider IN ('nowpayments', 'paystack', 'manual_transfer')),
    provider_payment_id TEXT,
    payment_reference TEXT UNIQUE NOT NULL,
    pay_amount NUMERIC(12, 2) NOT NULL,
    pay_currency TEXT NOT NULL DEFAULT 'NGN',
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'waiting', 'confirming', 'confirmed', 'sending', 'finished', 'failed', 'expired', 'refunded')),
    raw_response JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. PAYMENT EVENTS TABLE (Webhook logs)
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    provider TEXT NOT NULL DEFAULT 'nowpayments',
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    signature_valid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. WHOLESALE ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.wholesale_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    location TEXT NOT NULL,
    quantity_interested TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'approved', 'declined')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title TEXT NOT NULL,
    comment TEXT NOT NULL,
    is_verified_buyer BOOLEAN NOT NULL DEFAULT false,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_reference ON public.payments(payment_reference);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_wholesale_created_at ON public.wholesale_enquiries(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());

-- 2. Admin Users Policies
CREATE POLICY "Admins can view admin_users" ON public.admin_users
    FOR SELECT USING (public.is_admin());

-- 3. Products & Variants Policies (Public read for active items, Admin full access)
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view active product variants" ON public.product_variants
    FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage product variants" ON public.product_variants
    FOR ALL USING (public.is_admin());

-- 4. Inventory Policies (Public can view stock availability, Admin can manage)
CREATE POLICY "Public can view inventory availability" ON public.inventory
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage inventory" ON public.inventory
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view inventory movements" ON public.inventory_movements
    FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert inventory movements" ON public.inventory_movements
    FOR INSERT WITH CHECK (public.is_admin());

-- 5. Delivery Zones (Public read active zones, Admin manage)
CREATE POLICY "Public can view active delivery zones" ON public.delivery_zones
    FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage delivery zones" ON public.delivery_zones
    FOR ALL USING (public.is_admin());

-- 6. Orders & Order Items
CREATE POLICY "Customers can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Admins can manage orders" ON public.orders
    FOR ALL USING (public.is_admin());

CREATE POLICY "Customers can view items of their own orders" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.customer_id = auth.uid() OR public.is_admin())
        )
    );
CREATE POLICY "Admins can manage order items" ON public.order_items
    FOR ALL USING (public.is_admin());

-- 7. Payments & Payment Events
CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT USING (public.is_admin());
CREATE POLICY "Customers can view their order payment status" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = payments.order_id 
            AND (orders.customer_id = auth.uid() OR public.is_admin())
        )
    );
CREATE POLICY "Admins can manage payment events" ON public.payment_events
    FOR ALL USING (public.is_admin());

-- 8. Wholesale Enquiries (Public insert only, Admin full access)
CREATE POLICY "Public can submit wholesale enquiries" ON public.wholesale_enquiries
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and manage wholesale enquiries" ON public.wholesale_enquiries
    FOR ALL USING (public.is_admin());

-- 9. Reviews (Public view approved, Admin manage all)
CREATE POLICY "Public can view approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true OR public.is_admin());
CREATE POLICY "Admins can manage reviews" ON public.reviews
    FOR ALL USING (public.is_admin());

-- 10. Site Settings (Public read, Admin update)
CREATE POLICY "Public can view site settings" ON public.site_settings
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings
    FOR ALL USING (public.is_admin());

-- 11. Audit Logs (Admins only)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin());

-- ==============================================================================
-- ATOMIC STORED PROCEDURES & BUSINESS LOGIC
-- ==============================================================================

-- Function to handle new user registration profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'customer')
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic Function: Mark Order as Paid and Decrement Inventory Safely
CREATE OR REPLACE FUNCTION public.mark_order_paid_atomic(
    p_order_id UUID,
    p_payment_id UUID,
    p_provider_ref TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
    v_total_sachets_needed INT := 0;
    v_current_stock INT;
    v_product_id UUID;
    v_new_balance INT;
BEGIN
    -- 1. Fetch and lock order
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not found');
    END IF;

    -- If already paid, return success idempotently
    IF v_order.payment_status = 'paid' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Order already paid');
    END IF;

    -- 2. Calculate total sachets required across order items
    FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id LOOP
        v_total_sachets_needed := v_total_sachets_needed + (v_item.quantity * v_item.sachet_equivalent);
    END LOOP;

    -- 3. Get product inventory (JETTEA has single primary product inventory)
    SELECT id, product_id, total_sachets_in_stock INTO v_product_id, v_product_id, v_current_stock
    FROM public.inventory
    LIMIT 1
    FOR UPDATE;

    IF v_current_stock < v_total_sachets_needed THEN
        -- Still update payment as paid, but flag order for stock replenishment
        UPDATE public.orders 
        SET payment_status = 'paid', 
            fulfillment_status = 'processing',
            admin_notes = COALESCE(admin_notes, '') || E'\n[WARNING] Stock was low when payment confirmed.',
            updated_at = NOW()
        WHERE id = p_order_id;

        UPDATE public.payments 
        SET status = 'finished', updated_at = NOW() 
        WHERE id = p_payment_id;

        RETURN jsonb_build_object('success', true, 'warning', 'Low stock backorder condition');
    END IF;

    -- 4. Decrement inventory
    v_new_balance := v_current_stock - v_total_sachets_needed;
    UPDATE public.inventory 
    SET total_sachets_in_stock = v_new_balance, updated_at = NOW()
    WHERE product_id = v_product_id;

    -- 5. Record inventory movement
    INSERT INTO public.inventory_movements (
        product_id, order_id, change_sachets, balance_after, reason, notes
    ) VALUES (
        v_product_id, p_order_id, -v_total_sachets_needed, v_new_balance, 'order_sale',
        'Automatic decrement for paid Order #' || v_order.order_number
    );

    -- 6. Update order and payment status
    UPDATE public.orders
    SET payment_status = 'paid',
        fulfillment_status = 'processing',
        updated_at = NOW()
    WHERE id = p_order_id;

    UPDATE public.payments
    SET status = 'finished', updated_at = NOW()
    WHERE id = p_payment_id;

    RETURN jsonb_build_object(
        'success', true, 
        'order_number', v_order.order_number, 
        'new_balance_sachets', v_new_balance
    );
END;
$$;

-- Atomic Function: Manual Inventory Adjustment by Admin
CREATE OR REPLACE FUNCTION public.adjust_inventory_atomic(
    p_product_id UUID,
    p_change_sachets INT,
    p_reason TEXT,
    p_notes TEXT,
    p_admin_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_stock INT;
    v_new_balance INT;
BEGIN
    SELECT total_sachets_in_stock INTO v_current_stock
    FROM public.inventory
    WHERE product_id = p_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Product inventory not found');
    END IF;

    v_new_balance := v_current_stock + p_change_sachets;
    IF v_new_balance < 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Inventory balance cannot be negative');
    END IF;

    UPDATE public.inventory
    SET total_sachets_in_stock = v_new_balance, updated_at = NOW()
    WHERE product_id = p_product_id;

    INSERT INTO public.inventory_movements (
        product_id, change_sachets, balance_after, reason, notes, created_by
    ) VALUES (
        p_product_id, p_change_sachets, v_new_balance, p_reason, p_notes, p_admin_id
    );

    RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;

-- ==============================================================================
-- INITIAL SEED DATA (JETTEA® Brand & Inventory: 90 Cartons / 25,920 Sachets)
-- ==============================================================================

-- 1. Insert Product
INSERT INTO public.products (
    id, slug, name, tagline, description, how_to_prepare, features, images, is_active, display_order
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'jettea-green-tea',
    'JETTEA® Green Tea',
    'FOR HEALTHY LIVING',
    'JETTEA® is a specially crafted premium green tea blend formulated for healthy living and daily revitalization. Produced to the highest quality standards by J.C. Bonjour Concerns Limited (JCBC), JETTEA® delivers rich antioxidants, natural refreshment, and wholesome vitality in every cup.',
    '1. Boil fresh water to 80°C–90°C (just before a rolling boil).\n2. Place one JETTEA® sachet into your favourite cup or mug.\n3. Pour 200ml–250ml of hot water over the sachet.\n4. Steep for 3 to 5 minutes to release the rich botanical aroma and golden infusion.\n5. Enjoy warm in the morning or evening for refreshing, healthy living.',
    '[
        {"title": "Rich in Natural Antioxidants", "description": "Supports body wellness, metabolic balance, and cellular health."},
        {"title": "100% Pure & Wholesome", "description": "No artificial preservatives or unnecessary fillers."},
        {"title": "Individual Freshness Sachets", "description": "Sealed for maximum botanical potency, aroma, and flavor in every cup."},
        {"title": "Manufactured by JCBC", "description": "Proudly produced in Nigeria under strict quality assurance standards."}
    ]'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80'
    ]::TEXT[],
    true,
    1
) ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description;

-- 2. Insert Product Variants
-- Sachet: ₦400 (1 sachet)
-- Packet: 24 sachets = ₦9,600
-- Carton: 12 packets = 288 sachets = ₦115,200 (Wholesale rate configurable)
INSERT INTO public.product_variants (
    id, product_id, sku, name, unit_type, sachet_equivalent, price, compare_at_price, wholesale_price, is_active, display_order
) VALUES 
(
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'JT-SACHET-01',
    'Single Sachet',
    'sachet',
    1,
    400.00,
    NULL,
    NULL,
    true,
    1
),
(
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'JT-PACKET-24',
    'Retail Packet (24 Sachets)',
    'packet',
    24,
    9600.00,
    10000.00,
    NULL,
    true,
    2
),
(
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'JT-CARTON-288',
    'Master Carton (12 Packets / 288 Sachets)',
    'carton',
    288,
    115200.00,
    120000.00,
    98000.00, -- Default initial wholesale rate
    true,
    3
) ON CONFLICT (sku) DO UPDATE SET 
    price = EXCLUDED.price,
    sachet_equivalent = EXCLUDED.sachet_equivalent;

-- 3. Insert Initial Inventory: 90 Cartons = 1,080 Packets = 25,920 Sachets
INSERT INTO public.inventory (
    product_id, total_sachets_in_stock, low_stock_threshold
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    25920, -- 90 cartons * 12 packets * 24 sachets
    2880  -- 10 cartons low stock threshold
) ON CONFLICT (product_id) DO UPDATE SET 
    total_sachets_in_stock = EXCLUDED.total_sachets_in_stock;

-- Record Initial Seed Movement
INSERT INTO public.inventory_movements (
    product_id, change_sachets, balance_after, reason, notes
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    25920,
    25920,
    'initial_seed',
    'Initial inventory setup: 90 master cartons (1,080 packets / 25,920 sachets)'
);

-- 4. Insert Delivery Zones
INSERT INTO public.delivery_zones (name, states, fee, estimated_days, is_active) VALUES
('Lagos Metropolitan (Express Delivery)', ARRAY['Lagos'], 2000.00, '1-2 business days', true),
('South-West Zone (Oyo, Ogun, Osun, Ondo, Ekiti)', ARRAY['Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'], 3500.00, '2-3 business days', true),
('Abuja (FCT) & Central Region', ARRAY['Federal Capital Territory', 'Abuja', 'Nasarawa', 'Niger', 'Kogi', 'Kwara', 'Plateau', 'Benue'], 4000.00, '2-4 business days', true),
('South-East & South-South States', ARRAY['Rivers', 'Delta', 'Edo', 'Enugu', 'Anambra', 'Imo', 'Abia', 'Akwa Ibom', 'Cross River', 'Bayelsa', 'Ebonyi'], 4500.00, '3-5 business days', true),
('Northern States Delivery', ARRAY['Kano', 'Kaduna', 'Katsina', 'Sokoto', 'Kebbi', 'Zamfara', 'Bauchi', 'Gombe', 'Borno', 'Yobe', 'Taraba', 'Adamawa', 'Jigawa'], 5000.00, '3-6 business days', true),
('Self-Pickup / JCBC Depot Dispatch', ARRAY['Pickup'], 0.00, 'Same-day after confirmation', true);

-- 5. Insert Site Settings
INSERT INTO public.site_settings (id, value, description) VALUES
('general', '{
    "brand_name": "JETTEA®",
    "brand_tagline": "FOR HEALTHY LIVING",
    "company_name": "J.C. Bonjour Concerns Limited",
    "company_abbreviation": "JCBC",
    "support_email": "support@jettea.ng",
    "contact_phone": "+2348000000000",
    "whatsapp_number": "+2348000000000",
    "currency_symbol": "₦",
    "currency_code": "NGN",
    "announcement": "Order authentic JETTEA® Green Tea directly from J.C. Bonjour Concerns Limited. Fast nationwide delivery across Nigeria."
}'::jsonb, 'General business and contact configuration'),
('seo', '{
    "meta_title": "JETTEA® Green Tea | FOR HEALTHY LIVING | Official Store",
    "meta_description": "Discover authentic JETTEA® Green Tea by J.C. Bonjour Concerns Limited (JCBC). Rich in natural antioxidants for healthy living. Order sachets, packets, or wholesale cartons with nationwide delivery.",
    "og_image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    "google_site_verification": "",
    "keywords": ["JETTEA", "JETTEA Green Tea", "JETTEA Nigeria", "JETTEA For Healthy Living", "J.C. Bonjour Concerns Limited", "Green Tea Nigeria", "Buy Green Tea Lagos", "Healthy Living Green Tea"]
}'::jsonb, 'SEO and Search Engine Indexing defaults');
