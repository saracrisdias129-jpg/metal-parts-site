const SUPABASE_URL = "https://iagrhzfxqixetsazjhkd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_JyYyKya1UMBCbgnPsyAKXw_fLpEbfXl";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);