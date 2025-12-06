/* eslint-disable no-undef */
import axios from 'axios'
const UNAUTHORIZE_CODE = 401

// ---------------------------------
// -----     Interceptor     -------
// ---------------------------------

const AccessTokenInterceptor = {
  addAccessToken: config => {
    const accessToken = sessionStorage.getItem('at')

    if (accessToken) {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...config.headers,
      }
      config.headers = headers
    }

    return config
  },

  onRejected: error => {
    return Promise.reject(error)
  },
}

const UnauthorizeInterceptor = {
  onFullfilled: response => {
    if (response.data.error) {
      if (
        !['AuthenticationError', 'InvalidAccessTokenError', 'ExpiredAccessTokenError'].includes(
          response.data.error.type,
        )
      ) {
        const err = response.data.error
        console.error('LỖI: ' + err.message)
        //   message.error("Error: " + err.message);
        return Promise.reject(err)
      }

      const accessToken = sessionStorage.getItem('at')
      if (accessToken) {
        //   message.warn(Messages.tokenIsExpire);
        // Notification.showError(Messages.tokenIsExpire)
        sessionStorage.removeItem('at')
      }

      window.location.href = '/login'

      return Promise.reject(error)
    } else {
      return Promise.resolve(response.data.data)
    }
  },

  onRejected: error => {
    if (!error) {
      return
    }

    const errorStatus = error && error.response && error.response.status
    if (errorStatus !== UNAUTHORIZE_CODE) {
      const err = error.response?.data?.error || error
      console.error('LỖI: ' + err.message)
      //   message.error("Error: " + err.message);
      return Promise.reject(err)
    }

    const accessToken = sessionStorage.getItem('at')
    if (accessToken) {
      //   message.warn(Messages.tokenIsExpire);
      // Notification.showError(Messages.tokenIsExpire)
      sessionStorage.removeItem('at')
    }

    window.location.href = '/login'

    return Promise.reject(error)
  },
}

const getInstance = config => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 120000,
    ...config,
  })

  instance.interceptors.response.use(
    UnauthorizeInterceptor.onFullfilled,
    UnauthorizeInterceptor.onRejected,
  )

  instance.interceptors.request.use(
    AccessTokenInterceptor.addAccessToken,
    AccessTokenInterceptor.onRejected,
  )
  return instance
}

function API(prefix = '') {
  const baseURL = import.meta.env.VITE_API_BASE_URL + prefix
  return getInstance({
    baseURL,
  })
}

export default API
