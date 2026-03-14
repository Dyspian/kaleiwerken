import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://sjfosmcpbekkokmedwil.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZm9zbWNwYmVra29rbWVkd2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDAwMzQsImV4cCI6MjA4OTA3NjAzNH0.J4merO1jIzh3gysLZJx-h6hIPtUNfNeSrcovcA4rTVo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);