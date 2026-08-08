import { isAxiosError } from 'axios'

/** Axios errors are already toasted by the axios interceptor. */
export function isHandledApiError(error: unknown) {
  return isAxiosError(error)
}
