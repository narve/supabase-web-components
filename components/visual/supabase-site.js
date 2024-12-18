import {html} from '../../src/index-externals.js';
import {SWCElement} from "../SWCElement.js";
import '../../src/index.js'
import {NamedJSONComparer} from "../../src/main.js";
// import {showToastMessage, toastTypes} from "../../src/index";
import {UserLoggedIn} from "../../src/events.js";
import {getSupabaseRoot} from "../../src/utils.js";

export class SupabaseSite extends SWCElement {
    static properties = {
        sections: {state: true},
        client: {state: true},
        api: {state: true},
        user: {state: true},
        source: {state: true, hasChanged: NamedJSONComparer('SupabaseSite.source')},
        item: {state: true, hasChanged: NamedJSONComparer('SupabaseSite.item')},

        title: {state: true},
        url: {state: true},
        key: {state: true},
    }

    constructor() {
        super()
        console.log('Constructing ' + this.constructor.name)
        getSupabaseRoot(this).addEventListener(UserLoggedIn, e => {
            this.logAndHandle( e, () => this.user = e.detail.user)
        })


        // const shadow = this.attachShadow({mode: 'open'});
        const stylesheet = new CSSStyleSheet();
        fetch('/supabase-web-components/components/visual/hamburger.css')
            .then(response => response.text())
            .then(css => {
                stylesheet.replaceSync(css);
                document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
                // shadow.adoptedStyleSheets = [stylesheet];
            });

    }

    logAndHandle(event, action) {
        console.log(`${this.constructor.name}: Handling event: `, event, action)
        action()
    }

    connectedCallback() {
        super.connectedCallback()
        this.title = this.getAttribute("title")
        this.url = this.getAttribute("url")
        this.key = this.getAttribute("key")
    }

    toggleVisibility(id) {
        console.log('toggling visibility of: ', id)
        const el = document.getElementById(id)
        el.open = !el.open
        el.style.display = el.open ? 'block' : 'none'
    }

    render() {
        return html`
            
            <div is="supabase-root">


                <nav>
                    <!-- Always visible items in the nav bar -->
                    <ul>
                        <li>
                            <a
                                @click="${() => this.toggleVisibility('swc-supabase-connection')}"
                            >AppInfo</a>
                        </li>
                    </ul>
                    <!-- The hamburger menu -->
                    <label for='menu' tabindex="0">
                        🍔
                    </label>
                    <input id='menu' type='checkbox' />
                    <!-- The collapsable menu -->
                    <ul>
                        <li><a>Mastodon</a></li>
                        <li><a>Twitter</a></li>
                        <li><a>Github</a></li>
                    </ul>
                </nav>           
                
                
            <h1>${this.title || 'SWC'}</h1>

            <details id="swc-supabase-connection" ?open="${!this.client}">
                <summary>${this.client ? 'Connected!' : 'Connect'}</summary>
                <div>
                    <supabase-connection
                            siteTitle="${this.title}" supabaseUrl="${this.url}" supabaseKey="${this.key}"
                            @client-created="${e => this.client = e.detail.client}"
                    ></supabase-connection>
                </div>
            </details>

            <details ?open="${this.client && !this.user}">
                <summary>${this.user ? `Logged in as ${this.user.email}` : 'Log in'}</summary>
                <div>
                    <html-include no-shadow src="../html/login-email.html"
                                  @user-logged-in="${e => this.logAndHandle( e, () => this.user = e.detail.user)}"
                    ></html-include>

                    <html-include no-shadow src="../html/register-email.html"></html-include>

                    
                    
                    ${true ? '' : html`
                    <supabase-login-email
                            .client="${this.client}"
                            @user-logged-in="${e => this.logAndHandle( e, () => this.user = e.detail.user)}"
                    ></supabase-login-email>
                    `}
                </div>
            </details>

            <details ?open="${this.client}">
                <summary>Index</summary>
                <div>
                    <supabase-index
                            .client="${this.client}"
                            @supabase-source-selected="${e => this.source = e.detail.source}"
                            @api-fetched="${e => this.api = e.detail.api}"
                    ></supabase-index>
                </div>
            </details>

            <details ?open="${this.client && this.source}">
                <summary>Data</summary>
                <div>
                    <supabase-table
                            .client="${this.client}" .source="${this.source}" .api="${this.api}"
                            @supabase-new-item="${e => this.item = e.detail.item}"
                    ></supabase-table>
                </div>
            </details>

            <details ?open="${this.item}">
                <summary>Item</summary>
                <div>
                    <supabase-item
                            .api="${this.api}"
                            .source="${this.source}"
                            .client="${this.client}"
                            .item="${this.item}"
                    ></supabase-item>
                </div>
            </details>

            </div>
        `
    }
}

customElements.define('supabase-site', SupabaseSite);
