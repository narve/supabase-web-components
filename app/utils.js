export const getSupabaseRoot = (cur) => {
    while (cur &&
    (cur.tagName !== 'SUPABASE-ROOT'
        &&
        cur.getAttribute('is') !== 'supabase-root')) {
        // console.log('miss: ', cur.getAttribute('is'))
        cur = cur.parentNode

    }
    return cur
}

