import {LitElement, css, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {__swc as swc} from './main.js'
import {SWCElement} from "./SWCElement.js";


export class SupabaseAuth extends SWCElement {

    submit(evt) {
        const form = evt.target.form
        evt.preventDefault()
        console.log('submit', form)

        const formData = new FormData(form);
        // output as an object
        console.log(Object.fromEntries(formData));

        const supabaseUrl = 'https://ckckpffruooypdyizcaq.supabase.co'
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrY2twZmZydW9veXBkeWl6Y2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTUwNTQ2MTUsImV4cCI6MTk3MDYzMDYxNX0.rl3mfWLkgLUELKxfjx1XUj2YbtcS8LbBafDWRr3xwfo"
        // const supabase = createClient(supabaseUrl, supabaseKey)

        // const supabaseUrl = 'https://xupzhicrqmyvtgztrmjb.supabase.co'
        // const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMDExNjg5NCwiZXhwIjoxOTI1NjkyODk0fQ.cvK8Il2IbFqU03Q4uOhSQ9jxFkWELLACX7mJKyy_Ue0"
        const client = supabase.createClient(supabaseUrl, supabaseKey)
    }

    render() {
        return html`
            <details open>
                <summary>Auth</summary>
                <div>
                
                    <form>
                        <label for="supabaseUrl">
                            <input type="text" id="supabaseUrl" name="supabaseUrl" placeholder="Supabase URL">
                        </label>
                        <label for="supabaseKey">
                            <input type="text" id="supabaseKey" name="supabaseKey" placeholder="Supabase Key">
                        </label>
                        <label for="siteTitle">
                            <input type="text" id="siteTitle" name="siteTitle" placeholder="Site Title">
                        </label>
                        <label>
                            <input type="submit" value="Submit" @click="${this.submit}">
                        </label>
                    </form>
                </div>
            </details>
        `
    }
}

customElements.define('supabase-auth', SupabaseAuth);
