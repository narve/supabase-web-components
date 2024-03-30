import {html} from './index-supabase.js';
import {SWCElement} from "./SWCElement.js";
import './index.js'


export class SupabaseSite extends SWCElement {

    render() {
        return html`
            <h1>Supabase</h1>
            <supabase-auth></supabase-auth>
            <supabase-index></supabase-index>
            <supabase-table></supabase-table>
            <supabase-item></supabase-item>
        `
    }
}

customElements.define('supabase-site', SupabaseSite);
