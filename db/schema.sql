-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  reset_password_token TEXT,
  reset_password_expiry TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add row level security to users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read only their own data
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update only their own data
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  business_size TEXT,
  industry TEXT NOT NULL,
  business_address TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add row level security to businesses table
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read only their own businesses
CREATE POLICY "Users can read their own businesses" ON businesses
  FOR SELECT
  USING (auth.uid() = owner_id);

-- Create policy to allow users to create businesses
CREATE POLICY "Users can create businesses" ON businesses
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Create policy to allow users to update their own businesses
CREATE POLICY "Users can update their own businesses" ON businesses
  FOR UPDATE
  USING (auth.uid() = owner_id);

-- Create policy to allow users to delete their own businesses
CREATE POLICY "Users can delete their own businesses" ON businesses
  FOR DELETE
  USING (auth.uid() = owner_id);

-- Tax profiles table
CREATE TABLE IF NOT EXISTS tax_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tin_number TEXT NOT NULL,
  vat_registered BOOLEAN DEFAULT FALSE,
  fiscal_year_end TEXT NOT NULL,
  bir_registration_date TEXT,
  business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add row level security to tax_profiles table
ALTER TABLE tax_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read only their own businesses' tax profiles
CREATE POLICY "Users can read their own tax profiles" ON tax_profiles
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = tax_profiles.business_id 
    AND businesses.owner_id = auth.uid()
  ));

-- Create policy to allow users to create tax profiles for their own businesses
CREATE POLICY "Users can create tax profiles" ON tax_profiles
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = tax_profiles.business_id 
    AND businesses.owner_id = auth.uid()
  ));

-- Create policy to allow users to update tax profiles for their own businesses
CREATE POLICY "Users can update tax profiles" ON tax_profiles
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = tax_profiles.business_id 
    AND businesses.owner_id = auth.uid()
  ));

-- Bookkeeping preferences table
CREATE TABLE IF NOT EXISTS bookkeeping_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accounting_method TEXT DEFAULT 'accrual',
  chart_of_accounts TEXT DEFAULT 'standard',
  currency_preference TEXT DEFAULT 'PHP',
  digital_receipts BOOLEAN DEFAULT TRUE,
  business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add row level security to bookkeeping_preferences table
ALTER TABLE bookkeeping_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read only their own businesses' bookkeeping preferences
CREATE POLICY "Users can read their own bookkeeping preferences" ON bookkeeping_preferences
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = bookkeeping_preferences.business_id 
    AND businesses.owner_id = auth.uid()
  ));

-- Create policy to allow users to create bookkeeping preferences for their own businesses
CREATE POLICY "Users can create bookkeeping preferences" ON bookkeeping_preferences
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = bookkeeping_preferences.business_id 
    AND businesses.owner_id = auth.uid()
  ));

-- Create policy to allow users to update bookkeeping preferences for their own businesses
CREATE POLICY "Users can update bookkeeping preferences" ON bookkeeping_preferences
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.id = bookkeeping_preferences.business_id 
    AND businesses.owner_id = auth.uid()
  ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at columns
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_businesses_timestamp
BEFORE UPDATE ON businesses
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_tax_profiles_timestamp
BEFORE UPDATE ON tax_profiles
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_bookkeeping_preferences_timestamp
BEFORE UPDATE ON bookkeeping_preferences
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
