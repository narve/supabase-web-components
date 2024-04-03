import "https://cdn.jsdelivr.net/npm/cb-toast@1.0.2/dist/cb-toast/cb-toast.esm.js"

export const toastTypes = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
}

export const showToastMessage = (type, title, description, timeOut = 1000) => {
    let cbToast = document.querySelector('cb-toast')

    if(!cbToast) {
        console.debug('Appending cbToast element')
        cbToast = document.createElement('cb-toast')
        document.body.append(cbToast)
    }

    console.debug({
        title, //default
        description: description || '', // override default
        timeOut, //default
        position: 'top-right', //default
        type, //default
    })

    if(!cbToast) {
        console.error('Could not find cbToast element')
        return
    }
    cbToast.Toast({
        title,
        description,
        timeOut,
        position: 'top-right',
        type,
    })
}