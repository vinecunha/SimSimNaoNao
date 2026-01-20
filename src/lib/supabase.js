import { createClient } from '@supabase/supabase-js';

// Suas credenciais aplicadas corretamente
const supabaseUrl = 'https://knfpxjjfguetssdyvfof.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZnB4ampmZ3VldHNzZHl2Zm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NTM0MTMsImV4cCI6MjA4NDQyOTQxM30.9SHS0RAaJYaXphXV3_nkxwv62LZm2cidTI6SVp9Mik4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);