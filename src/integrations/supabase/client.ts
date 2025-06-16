
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://rqxrwvhgdnxzumbrrplg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxeHJ3dmhnZG54enVtYnJycGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTUzNjEsImV4cCI6MjA2MzkzMTM2MX0.XtJxIccunytStPetqTIHg692m5bJZ3rTwVt5sMfMZwI"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
