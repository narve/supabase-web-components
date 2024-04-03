import {html, map} from './index-supabase.js';
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
        window.addEventListener(ClientCreated, e => {
            const section = document.querySelector('supabase-connection')
                .parentElement
                .parentElement
            console.log('closing section: ', section)
            section.open = false;
        })

    }

    // setActiveSection(section) {
    //     const allSections = document.querySelectorAll(`[tab-title]`)
    //     for (const s of allSections) {
    //         s.style.display = 'none'
    //     }
    //     const activeElement = document.querySelector(`[tab-title="${section.title}"]`)
    //     activeElement.style.display = 'block'
    //     console.log('setActiveSection: ', section, activeElement)
    // }

    render() {
        return html`
            ${map(this.sections, s => html`
                <details open>
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
