import {html, when, map} from './index-supabase.js';
import {SWCElement} from "./SWCElement.js";
import {ClientCreated} from "./events.js";

console.log('auth module')

// const sections = [
//     {
//         title: 'Connection',
//         render: () => this.connectionSection()
//     }
// ]

export class SupabaseAuth extends SWCElement {
    static properties = {
        generatedUrl: {state:true},
    }

    // static styles = css`
    //     .auth_section {
    //         display: none;
    //     }`


    constructor() {
        super();
        this.generatedUrl = ''
    }

    sections = [
        {
            title: 'Connection',
            render: () => this.connectionSection()
        },
        {
            title: 'Login with email',
            render: () => this.loginWithEmailSection()
        },
    ]

    generateUrl(event) {
        const formData = new FormData(event.target.form);
        this.generatedUrl = "#supabaseUrl=" + formData.get('supabaseUrl') + "&supabaseKey=" + formData.get('supabaseKey') + "&siteTitle=" + formData.get('siteTitle')
        console.log({generatedUrl: this.generatedUrl})
    }


    connectedCallback() {
        super.connectedCallback();

        // const supabaseUrl = 'https://ckckpffruooypdyizcaq.supabase.co'
        // const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrY2twZmZydW9veXBkeWl6Y2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTUwNTQ2MTUsImV4cCI6MTk3MDYzMDYxNX0.rl3mfWLkgLUELKxfjx1XUj2YbtcS8LbBafDWRr3xwfo"

        const supabaseUrl = 'https://xupzhicrqmyvtgztrmjb.supabase.co'
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMDExNjg5NCwiZXhwIjoxOTI1NjkyODk0fQ.cvK8Il2IbFqU03Q4uOhSQ9jxFkWELLACX7mJKyy_Ue0"
        const client = supabase.createClient(supabaseUrl, supabaseKey)
        this.client = client

        console.log('auth: ', {client})

        setTimeout( () => window.dispatchEvent(new CustomEvent(ClientCreated, {detail: {client}})), 0)
    }

    submit(evt) {
        evt.preventDefault()
        const formData = new FormData(evt.target.form);
        console.log(Object.fromEntries(formData));

        // const supabaseUrl = 'https://ckckpffruooypdyizcaq.supabase.co'
        // const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrY2twZmZydW9veXBkeWl6Y2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTUwNTQ2MTUsImV4cCI6MTk3MDYzMDYxNX0.rl3mfWLkgLUELKxfjx1XUj2YbtcS8LbBafDWRr3xwfo"
        // const supabase = createClient(supabaseUrl, supabaseKey)

        const supabaseUrl = 'https://xupzhicrqmyvtgztrmjb.supabase.co'
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMDExNjg5NCwiZXhwIjoxOTI1NjkyODk0fQ.cvK8Il2IbFqU03Q4uOhSQ9jxFkWELLACX7mJKyy_Ue0"
        const client = supabase.createClient(supabaseUrl, supabaseKey)

        this.client = client
        console.log('auth: ', {client})

        window.dispatchEvent(new CustomEvent(ClientCreated, {detail: {client}}))
    }

    loginWithEmail(evt) {
        evt.preventDefault()
        const formData = new FormData(evt.target.form);

        console.log('loginWithEmail: ', evt)
        this.client.auth.signInWithPassword({
            email: formData.get('email'),
            password: formData.get('password'),
        })
    }

    loginWithEmailSection() {
        return html`
            <form>
                <fieldset>
                    <legend>Login with email</legend>
                    <label for="email">
                        <input type="email" id="email" name="email" placeholder="Email">
                    </label>
                    <label for="password">
                        <input type="password" id="password" name="password" placeholder="Password">
                    </label>
                    <label>
                        <input type="submit" value="Login" @click="${this.loginWithEmail}">
                    </label>
                </fieldset>
            </form>
        `
    }

    connectionSection() {
        return html`
        <form id="form_auth">
            <fieldset>
                <legend>Connection</legend>
                <label for="supabaseUrl">
                    <input type="text" id="supabaseUrl" name="supabaseUrl" placeholder="Supabase URL"
                           value="https://xupzhicrqmyvtgztrmjb.supabase.co">
                </label>
                <label for="supabaseKey">
                    <input type="text" id="supabaseKey" name="supabaseKey" placeholder="Supabase Key"
                           value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMDExNjg5NCwiZXhwIjoxOTI1NjkyODk0fQ.cvK8Il2IbFqU03Q4uOhSQ9jxFkWELLACX7mJKyy_Ue0">
                </label>
                <label for="siteTitle">
                    <input type="text" id="siteTitle" name="siteTitle" placeholder="Site Title"
                           value="Demo">
                </label>
                <label>
                    <input type="submit" value="Apply" @click="${this.submit}">
                </label>
                <label>
                    <input type="button" value="Generate url" @click="${this.generateUrl}">
                </label>

                ${when(this.generatedUrl,
                () => html`<label>
                            <input disabled readonly value="${this.generatedUrl}"
                        </label>`,
                () => null
            )}

            </fieldset>
        </form>`
    }

    setActiveSection(section) {
        const allSections = document.querySelectorAll(`[tab-title]`)
        for(const s of allSections) {
            s.style.display = 'none'
        }
        const activeElement = document.querySelector(`[tab-title="${section.title}"]`)
        activeElement.style.display = 'block'
        console.log('setActiveSection: ', section, activeElement)
    }

    render() {
        return html`
            <details open>
                <summary>Supabase configuration</summary>
                
                <nav>
                ${map(this.sections, s => html`
                    <li>
                        <a @click="${()=>this.setActiveSection(s)}" href="#${s.title}">${s.title}</a>`)}
                    </li>
                </nav>
                
                ${map(this.sections, s => html`
                    <div class="auth_section" tab-title="${s.title}" style="display: none">
                        <h3>${s.title}</h3>
                        ${s.render()}
                    </div>
                `)}
                
                
                <div>
                
                </div>
            </details>
        `
    }
}

customElements.define('supabase-auth', SupabaseAuth);
