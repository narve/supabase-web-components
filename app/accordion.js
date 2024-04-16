import {UserLoggedIn, UserLoggedOut} from "../src/events.js";

const root = document.querySelector('div[is="supabase-root"]')
root.addEventListener(UserLoggedOut, () => {
    setIsOpen('authenticated', false)
    setIsOpen('unauthenticated', true)
})
root.addEventListener(UserLoggedIn, () => {
    setIsOpen('authenticated', true)
    setIsOpen('unauthenticated', false)
})

const setIsOpen = (className, isOpen) => {
    document.querySelectorAll(`details.${className}`)
        .forEach(e => {
            console.debug('setting open to ', isOpen, ' for element ', e)
            e.open = isOpen;
        })
}

