import { toast } from 'react-toastify'

export const fileValidation = (files: any) => {
  const MIN_FILE_SIZE = 1024 // 1MB
  const MAX_FILE_SIZE = 5120 // 5MB
  let success = true
  const fileSizeKiloBytes = files.size / 1024

  if (fileSizeKiloBytes > MAX_FILE_SIZE) {
    toast.error('File size is greater than maximum limit')
    success = false

    return false
  }
  if (!files.name.match(/\.(jpg|jpeg|png|)$/)) {
    toast.error('Please select valid image.')
    return false
  }
  return true
}
export const fileValidationSVG = (files: any) => {
  const MIN_FILE_SIZE = 1024 // 1MB
  const MAX_FILE_SIZE = 5120 // 5MB
  let success = true
  const fileSizeKiloBytes = files.size / 1024

  if (fileSizeKiloBytes > MAX_FILE_SIZE) {
    toast.error('File size is greater than maximum limit')
    success = false

    return false
  }
  if (!files.name.match(/\.(svg|)$/)) {
    toast.error('Please upload svg image.')
    return false
  }
  return true
}
