import "https://cdn.jsdelivr.net/npm/cb-toast@1.0.2/dist/cb-toast/cb-toast.esm.js"

export const toastTypes = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error',
    startOperation: 'start_operation'
}


window.addEventListener('error', event => {
    // console.error('My error: ', {event})
    showToastMessage(toastTypes.error, 'Internal error', event.error.message, 5000)
})
window.addEventListener('unhandledrejection', event => {
    // console.error(`My unhandledrejection: ${event.promise}, ${event.reason}`)
    showToastMessage(toastTypes.error, 'Internal error in promise handling',
        event.reason?.toString(), 5000)
})

export const showToastMessage = (type, title, description = '', timeOut = 1000) => {
    let cbToast = document.querySelector('cb-toast')

    if(!cbToast) {
        console.debug('Appending cbToast element')
        cbToast = document.createElement('cb-toast')
        document.body.append(cbToast)
    }

    console.debug('TOAST: ', {
        type,
        title,
        description,
        timeOut,
        position: 'top-right',
    })

    if(type === toastTypes.startOperation) {
        // Don't show this to users
        return
    }

    if(!cbToast) {
        console.error('Could not find cbToast element')
        return
    }
    cbToast.Toast({
        title,
        description: description || '', // Override default ,
        timeOut,
        position: 'top-right',
        type,
    })
}
