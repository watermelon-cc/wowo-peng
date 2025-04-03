import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yyriydjopvckeqlqtcbm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cml5ZGpvcHZja2VxbHF0Y2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDAyMzgsImV4cCI6MjA1OTA3NjIzOH0.WF5zN8MzEgPU9d8yi5iOUj-D6ucg54XcD3QscuH_1NY'

export const supabase = createClient(supabaseUrl, supabaseKey) 