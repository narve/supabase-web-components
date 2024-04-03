import {html, map, ifDefined} from './index-supabase.js';
import {SWCElement} from "./SWCElement.js";
import {ClientCreated} from "./events.js";


export class SupabaseAuth extends SWCElement {
    static properties = {
        sections: {state: true},
    }

    constructor() {
        super();
        this.generatedUrl = ''
    }

    sections = [
        {
            title: 'Connection',
            render: () => html`<supabase-connection></supabase-connection>`
        },
        {
            title: 'Login with email',
            render: () => html`<supabase-login-email></supabase-login-email>`
        },
    ]

    connectedCallback() {
        super.connectedCallback();
        const setOpen = (sectionName, open) => {
            const section = document.querySelector(`details[name="${sectionName}"]`)
            section.open = open;
        }
        window.addEventListener(ClientCreated, () => {
            setOpen('Connection', false)
            setOpen('Login with email', true)
            // const section = document.querySelector('details[name="Connection"]')
            //     // .parentElement
            //     // .parentElement
            // console.log('closing section: ', section)
            // section.open = false;
        })
    }

    render() {
        return html`
            
            <supabase-connection @supabase-client-created="${e => console.log('@client-created: ', e)}"></supabase-connection>
            
            ${map(this.sections, s => html`
                <details open="${ifDefined(s.title ==='Connection'?true:null)}" name="${s.title}">
                    <summary>${s.title}</summary>
                    <div>
                        ${s.render()}
                    </div>
                </details>
            `)}
        `
    }
}

customElements.define('supabase-auth', SupabaseAuth);
