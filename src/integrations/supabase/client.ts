import { createClient } from '@supabase/supabase-js';

// These are publishable keys — safe to store in code.
// Replace with your actual Supabase project values.
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
