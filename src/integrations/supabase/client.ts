// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qiolmyiilwzrmjisjdfc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpb2xteWlpbHd6cm1qaXNqZGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDA5MzUsImV4cCI6MjA2MDM3NjkzNX0.VrADNUYJ3m1VT5A14au4onuosm7Xh-iMM2BbBFcXmAg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);