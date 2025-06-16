
-- VPS PostgreSQL Database Setup
-- This script creates the necessary tables and functions for your expense notifier app
-- without Supabase-specific features

-- Create the app_role enum type
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('normal', 'super_user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    full_name TEXT,
    phone TEXT,
    status TEXT DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT,
    provider TEXT,
    provider_id UUID,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    frequency TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    register_date DATE,
    expiration_date DATE,
    last_payment DATE,
    paid_via TEXT,
    payment_method_id UUID,
    auto_renew BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    FOREIGN KEY (provider_id) REFERENCES public.providers(id),
    FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id)
);

CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    service_id UUID,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    description TEXT,
    category TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method_id UUID,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    FOREIGN KEY (service_id) REFERENCES public.services(id),
    FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id)
);

CREATE TABLE IF NOT EXISTS public.import_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    error_message TEXT NOT NULL,
    row_data TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.api_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    provider_name TEXT NOT NULL,
    api_key_encrypted TEXT,
    api_secret_encrypted TEXT,
    endpoint TEXT,
    enabled BOOLEAN DEFAULT false,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency INTEGER DEFAULT 24,
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    setting_type TEXT NOT NULL,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create functions for the import errors
CREATE OR REPLACE FUNCTION public.get_import_errors(_user_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    error_message TEXT,
    row_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
AS $$
    SELECT ie.id, ie.user_id, ie.error_message, ie.row_data, ie.created_at 
    FROM public.import_errors ie
    WHERE (_user_id IS NULL OR ie.user_id = _user_id)
    ORDER BY ie.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.clear_import_errors(_user_id UUID DEFAULT NULL)
RETURNS void
LANGUAGE sql
AS $$
    DELETE FROM public.import_errors 
    WHERE (_user_id IS NULL OR user_id = _user_id);
$$;

-- Create role checking functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_super_user(_user_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role IN ('admin', 'super_user')
    )
$$;

-- Insert a default admin user (you can change these details)
INSERT INTO public.profiles (id, email, full_name, status) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::UUID,
    'admin@example.com',
    'Admin User',
    'active'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::UUID,
    'admin'::app_role
) ON CONFLICT (user_id, role) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_user_id ON public.services(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_services_expiration_date ON public.services(expiration_date);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);

COMMENT ON TABLE public.profiles IS 'User profiles table';
COMMENT ON TABLE public.services IS 'Services/subscriptions table';
COMMENT ON TABLE public.expenses IS 'Expenses tracking table';
COMMENT ON TABLE public.user_roles IS 'User roles for authorization';
