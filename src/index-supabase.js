export {LitElement, css, html, when, map, styleMap, ifDefined} from 'https://cdn.jsdelivr.net/gh/lit/dist@3.1.2/all/lit-all.min.js'

import {ifDefined} from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.2/all/lit-all.min.js";

export { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/// Helper method because I like ifDefined to handle booleans
export const ifTruthy = (value, attr = 'true') => value ? attr : ifDefined(null)
export const ifFalsy = (value, attr = 'true') => !value ? attr : ifDefined(null)


