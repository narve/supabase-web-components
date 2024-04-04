
export const JSONComparer = (e1, e2) => {
    const res = JSON.stringify(e1) !== JSON.stringify(e2)
    // console.log('Comparing => ', res, {e1, e2})
    return res
}

export const NamedJSONComparer = (name) => {
    return (e1, e2) => {
        const res = JSON.stringify(e1) !== JSON.stringify(e2)
        // console.log('Comparing => ', name, res, {e1, e2})
        return res
    }
}
