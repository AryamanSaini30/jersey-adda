-- Create customers table
CREATE TABLE
  public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    phone TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    address_line_1 TEXT,
    address_line_2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
