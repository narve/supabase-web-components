import {LitElement, css, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {__swc as swc} from './main.js'
// import {SupabaseTable} from "./supabase-table.js";
// import {SupabaseTable} from "./supabase-table.js";
import {SWCElement} from "./SWCElement.js";


export class SupabaseSite extends SWCElement {

    render() {
        return html`
            <h1>Supabase</h1>
            <supabase-auth></supabase-auth>
            <supabase-index></supabase-index>
            <supabase-table></supabase-table>
        `
    }
}

customElements.define('supabase-site', SupabaseSite);
