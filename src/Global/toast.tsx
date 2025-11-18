import {toast} from 'react-toastify'

export const success = (message: string) => {
  return toast.success(message, {
    position: 'top-right',

    theme: 'colored',
  })
}
export const error = (message: string) => {
  return toast.error(message, {
    position: 'top-right',

    theme: 'colored',
  })
}
