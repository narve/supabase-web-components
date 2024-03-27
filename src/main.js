
// import { createClient } from '@supabase/supabase-js'

// const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

console.log({supabase})

const supabaseUrl = 'https://xupzhicrqmyvtgztrmjb.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMDExNjg5NCwiZXhwIjoxOTI1NjkyODk0fQ.cvK8Il2IbFqU03Q4uOhSQ9jxFkWELLACX7mJKyy_Ue0"

const client = supabase.createClient(supabaseUrl, supabaseKey)

console.log({client})

export const __swc = {client}
