import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://orkykhahvcobfqlmyxrf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ya3lraGFodmNvYmZxbG15eHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjQyNjEsImV4cCI6MjA5NjEwMDI2MX0.TCLIyCIGMcOhSmV57gg9zbPXWgge-KUnjjd8oKVPcoA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);