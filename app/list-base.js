import {SWCElement} from "./index.js";

import {getSupabaseRoot} from "./index.js";
import {showToastMessage, toastTypes} from "./index.js";
import {UserLoggedIn} from "./index.js";

export class ListBase extends SWCElement {
    constructor() {
        super();
        this.items = []
        this.source = ""
        this.subscribeSource = null
    }


    async connectedCallback() {
        super.connectedCallback()
        const root = getSupabaseRoot(this)
        // root.addEventListener('list-my-requests', async () => await this.fetch())
        root.addEventListener(UserLoggedIn, async () => {
            setTimeout(
                async () => {
                    await this.fetch()
                    await this.subscribe()
                },
                1)
        })
    }

    async handleTableEvent(payload) {
        console.log(this.constructor.name, 'Change received!', payload)
        if(payload.eventType === 'DELETE') {
            const index = this.items.findIndex(r => r.id === payload?.old?.id)
            this.log('slicing: ', index)
            this.items.splice(index,1)
            this.update()
        } else if(payload.eventType === 'INSERT') {
            this.items.push(payload.new)
            this.update()
        } else {
            await this.fetch()
        }
    }


    async subscribe() {
        // Initialize the JS client
        const client = getSupabaseRoot(this)?.client

        const subscribeSource = this.subscribeSource || this.source
        // console.log(this.constructor.name, 'subscribing', {subscribeSource})
        client
            .channel(this.constructor.name + "__" + subscribeSource)
            .on('postgres_changes',
                { event: '*', schema: 'public', table: subscribeSource },
                (event) => this.handleTableEvent(event))
            .subscribe()
    }

    async delete(item) {
        this.log('delete', item)
        const client = getSupabaseRoot(this).client
        const {id} = item
        const response = await client
            .from(this.subscribeSource || this.source)
            .delete({count:'exact'})
            .eq('id', id)
        const {error, count } = response
        if (error) {
            showToastMessage(toastTypes.error, "Ops!", error.message, 3000)
        } else if (count===0) {
            // await this.fetch()
            showToastMessage(toastTypes.error, "Hm... ingenting ble slettet?", error?.message, 3000)
        } else {
            showToastMessage(toastTypes.success, "Fjernet!", ``, 3000)
            // await this._fetch()
        }
    }

    async fetchImpl() {
        const client = getSupabaseRoot(this)?.client
        return await client
            .from(this.source)
            .select()
    }

    async fetch(event) {
        // this.log(this.constructor.name, 'fetch');
        const {error, data } = await this.fetchImpl()
        if(this.error) {
            showToastMessage(toastTypes.error, "Ops!", error.message, 3000)
        } else {
            this.items = data
        }
    }
}