import * as IDontNeedThis from "https://cdn.jsdelivr.net/npm/cb-toast@1.0.2/dist/cb-toast/cb-toast.esm.js"

const cbToast = document.querySelector('cb-toast')

export const toastTypes = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
}

export const showToastMessage = (type, title, description, timeOut = 1000) => {
    if(!cbToast)
        return
    cbToast.Toast({
        title, //default
        description, //: 'success message', //default
        timeOut, //default
        position: 'top-right', //default
        type, //default
    })
}