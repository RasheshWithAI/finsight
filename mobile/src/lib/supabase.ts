import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://qiolmyiilwzrmjisjdfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpb2xteWlpbHd6cm1qaXNqZGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDA5MzUsImV4cCI6MjA2MDM3NjkzNX0.VrADNUYJ3m1VT5A14au4onuosm7Xh-iMM2BbBFcXmAg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});