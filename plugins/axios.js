// plugins/axios.js
// Your Nuxt 3 $request helper using Axios
import Keys from '../common/keys'

import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    baseURL: '/',
    timeout: 20000,
  })

  axiosInstance.defaults.xsrfCookieName = 'csrftoken'
  axiosInstance.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

  let CancelToken = axios.CancelToken
  let source = CancelToken.source()

//   const Keys = {
//     GET: 'get',
//     POST: 'post',
//     PATCH: 'patch',
//     DELETE: 'delete',
//   }
//   const API_URLS = {}

  axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
      console.error('Axios error:', error?.response || error?.message)
      return Promise.reject(error)
    }
  )

  const errorHandler = (error) => {
    let msg = 'Request failed'
    if (error?.response?.data?.detail) msg = error.response.data.detail
    else if (error?.message) msg = error.message
    console.warn('[request:error]', msg)
  }

  const request = (
    method,
    url,
    {
      headers = {},
      params = {},
      data = {},
      onSuccess = null,
      onFailure = null,
      onFinally = null,
      responseType = 'json',
      onUploadProgress = null,
      onDownloadProgress = null,
      isTokenRequired = true,
      cancel = false,
    } = {}
  ) => {
    const allowed = [Keys.GET, Keys.POST, Keys.PATCH, Keys.DELETE]
    if (!allowed.includes(method)) return Promise.reject(new Error(`Method ${method} not allowed`))
    if (!url) return Promise.reject(new Error('url is required'))

    const config = {
      method,
      url,
      headers,
      params,
      data,
      responseType,
      onUploadProgress,
      onDownloadProgress,
    }

    if (cancel) {
      source.cancel('Cancelled by new request')
      source = CancelToken.source()
      config.cancelToken = source.token
    }

    // Token from cookie (adjust cookie name to your app)
    const accessTokenCookie = useCookie('accessToken')
    const accessToken = accessTokenCookie.value
    if (isTokenRequired && accessToken) {
      headers.authorization = `Bearer ${accessToken}`
    }

    return axiosInstance(config)
      .then((response) => {
        onSuccess?.(response)
        return response
      })
      .catch((error) => {
        if (onFailure) onFailure(error?.response)
        else errorHandler(error)
        throw error
      })
      .finally(() => {
        onFinally?.()
      })
  }

  nuxtApp.provide('request', request)
  nuxtApp.provide('Keys', Keys)
//   nuxtApp.provide('API_URLS', API_URLS)
})
