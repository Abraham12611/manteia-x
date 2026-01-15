
import { createClient } from '@supabase/supabase-js';

// These should be in .env.local, but for now we'll access them via process.env
// The user needs to set these variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
