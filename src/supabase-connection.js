import {html, when, createClient} from './index-externals.js';
import {SWCElement} from "./SWCElement.js";
import {ClientCreated} from "./events.js";
import {showToastMessage, toastTypes} from "./index.js";

const configs = [
    {
        siteTitle: 'Enrest',
        supabaseUrl: 'https://wuxcrmvzflfdqccxkeig.supabase.co',
        supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eGNybXZ6ZmxmZHFjY3hrZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI1Nzk1OTYsImV4cCI6MjAyODE1NTU5Nn0.48D1wN5alsizO3mT28Ct3C8rT6JkOF2XCS39PUgc6u8',
    },
    // {
    //     siteTitle: 'DV8MultiApp',
    //     supabaseUrl: 'https://xupzhicrqmyvtgztrmjb.supabase.co',
    //     supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMDExNjg5NCwiZXhwIjoxOTI1NjkyODk0fQ.cvK8Il2IbFqU03Q4uOhSQ9jxFkWELLACX7mJKyy_Ue0',
    // },
    {
        siteTitle: 'FOBS DEV',
        supabaseUrl: 'https://ckckpffruooypdyizcaq.supabase.co',
        supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrY2twZmZydW9veXBkeWl6Y2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTUwNTQ2MTUsImV4cCI6MTk3MDYzMDYxNX0.rl3mfWLkgLUELKxfjx1XUj2YbtcS8LbBafDWRr3xwfo',
    },
    {
        siteTitle: 'FOBS STAGING',
        supabaseUrl: 'https://cmrdcggpmoswwmzcdcxx.supabase.co',
        supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcmRjZ2dwbW9zd3dtemNkY3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE3OTYwOTcsImV4cCI6MTk3NzM3MjA5N30.LTa9fTKZuHLhh2wBR6dJEw7gyGFrq2kl08yqemqkq7w',
    },
]
const showConfigs = () => location.href.indexOf('dedica') > 0 || location.href.indexOf('localhost') > 0

export class SupabaseConnection extends SWCElement {

    static properties = {
        siteTitle: {state: true},
        supabaseUrl: {state: true},
        supabaseKey: {state: true},
    }

    constructor() {
        super();
        this.siteTitle = ''
        this.supabaseUrl = ''
        this.supabaseKey = ''
    }

    setConfig(config) {
        this.siteTitle = config.siteTitle
        this.supabaseUrl = config.supabaseUrl
        this.supabaseKey = config.supabaseKey
    }

    apply(event) {
        event.preventDefault()
        showToastMessage(toastTypes.info, 'Connecting to ' + this.siteTitle)
        // console.log('SupabaseConnection::apply: ', {siteTitle: this.siteTitle, supabaseUrl: this.supabaseUrl, supabaseKey: this.supabaseKey})
        const client = createClient(this.supabaseUrl, this.supabaseKey)
        showToastMessage(toastTypes.success, 'Connected to ' + this.siteTitle)
        this.dispatch(ClientCreated, {client, siteTitle: this.siteTitle})
    }

    connectedCallback() {
        super.connectedCallback();
        if (showConfigs()) {
            this.setConfig(configs[0])
            // Apply immediately:
            this.apply(new Event('click'))
        }
    }

    render() {
        const configSection = !showConfigs()
            ? null
            : html`
                    ${configs.map(c => html`
                        <a @click="${() => this.setConfig(c)}" href="#">${c.siteTitle}</a>
                    `)}
            `

        return html`
            <form id="form_auth">
                <fieldset>
                    <legend>Connection</legend>

                    ${configSection}

                    <label for="siteTitle">
                        <input type="text" id="siteTitle" name="siteTitle" placeholder="Site Title"
                               value="${this.siteTitle}">
                    </label>
                    <label for="supabaseUrl">
                        <input type="text" id="supabaseUrl" name="supabaseUrl" placeholder="Supabase URL"
                               value="${this.supabaseUrl}">
                    </label>
                    <label for="supabaseKey">
                        <input type="text" id="supabaseKey" name="supabaseKey" placeholder="Supabase Key"
                               value="${this.supabaseKey}">
                    </label>
                    <label>
                        <input type="submit" value="Apply" @click="${this.apply}">
                    </label>
                    <!--                    <label>-->
                        <!--                        <input type="button" value="Generate url" @click="${this.generateUrl}
                        ">-->
                    <!--                    </label>-->

                    ${when(this.generatedUrl,
                            () => html`<label>
                                <input disabled readonly value="${this.generatedUrl}"
                            </label>`
                    )}

                </fieldset>
            </form>`
    }
}

customElements.define('supabase-connection', SupabaseConnection);
