-- Add role to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text CHECK (role IN ('lender', 'borrower'));

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_address text NOT NULL REFERENCES public.profiles(wallet_address),
    type text NOT NULL CHECK (type IN ('loan_request', 'funded', 'repayment', 'withdrawal')),
    amount numeric,
    tx_hash text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own transactions
CREATE POLICY "Users can view own transactions" 
ON public.transactions FOR SELECT 
TO authenticated, anon
USING (user_address = current_setting('request.jwt.claim.sub', true) OR true); -- Simplification for hackathon (auth via wallet address matching)

-- Note: For the hackathon, we'll allow public reads if we don't have full JWT auth set up for wallets in Supabase yet, 
-- but ideally this matches the wallet address. 
-- Since we are using client-side calls, we'll allow insert for now or handle via API routes.
CREATE POLICY "Allow public insert for demo" 
ON public.transactions FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);
