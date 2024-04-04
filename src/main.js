
const isDebugEnabled = false

export const NamedJSONComparer = (name) => {
    return (e1, e2) => {
        const res = JSON.stringify(e1) !== JSON.stringify(e2)
        if(isDebugEnabled)
            console.debug('Comparing => ', name, res, {e1, e2})
        return res
    }
}
