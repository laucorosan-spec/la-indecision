import { createClient } from '@supabase/supabase-js'

// Sustituye lo que hay entre comillas por lo que copiaste en el paso 1
const supabaseUrl = 'https://xvfxeqvthttysmjkedsi.supabase.co/rest/v1/'
const supabaseAnonKey = 'sb_publishable_ip6Vy6p4XqpxkWm5AodtQg_8mGPAJoB'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
