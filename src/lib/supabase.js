import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hnzdtwhttoyvyxdcmbnq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuemR0d2h0dG95dnl4ZGNtYm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MDQ3OTQsImV4cCI6MjA1ODk4MDc5NH0.j9JOceEP96Pjw8mpDUneCppgIdBrjgIrEEbmdkKTbSM'

export const supabase = createClient(supabaseUrl, supabaseKey) 