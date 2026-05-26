import { createClient } from '@supabase/supabase-js'

// Limpiamos la URL para que no tenga el "/rest/v1/" al final
const supabaseUrl = 'https://xvfxeqvthttysmjkedsi.supabase.co'
const supabaseAnonKey = 'sb_publishable_ip6Vy6p4XqpxkWm5AodtQg_8mGPAJoB'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
