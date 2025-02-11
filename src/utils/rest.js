import axios from 'axios'
import { useUserStore } from '../stores/user'

const server = 'http://localhost:8000'

async function template({ method, url, params, query, headers }) {
  if (!method || !url) {
    console.error('method and url are required')
    console.error(method)
    console.error(url)
    throw new Error('method and url are required')
  }
  const userStore = useUserStore()
  if (!headers) {
    headers = {}
  }
  if (userStore.token) {
    headers.jwt = userStore.token
  }

  // if first character of url is not '/', add '/'
  if (url.charAt(0) !== '/') {
    url = `/${url}`
  }
  console.log(`rest.template::`)
  console.log(`url: ${url}`)
  console.log(`params:`)
  console.log(params)
  console.log(`query: ${query}`)

  try {
    if (params) {
      console.log('post, put')
      const response = await axios.post(`${server}${url}`, params, { headers })
      return response
      // return method(`${server}${url}`, params, { headers })
    } else if (query) {
      console.log('get')
      return method(`${server}${url}?${query}`, { headers })
    } else {
      return method(`${server}${url}`, { headers })
    }
  } catch (error) {
    // console.error(error)
    const messages = error.response?.data?.errors || []
    console.log(error.response)
    if (messages.length > 0) {
      alert(messages.join('\n'))
    }
    console.log(`AxiosError: message: ${messages}, status: ${error.status}`)
    return error.response
  }
}

export function get(url, params = {}) {
  // destruct params of params then create get query string
  const query = new URLSearchParams(params).toString()

  return template({ method: axios.get, url, query })
}

export function post(url, params = {}, headers = null) {
  return template({ method: axios.post, url, params, headers })
}

export function put(url, params = {}) {
  return template({ method: axios.put, url, params })
}

/**
 *
 *
 * * `delete` is a reserved word in JavaScript, so we use `del` instead.
 *
 * @param {*} url
 * @param {*} params
 * @returns
 */
export function del(url) {
  return template({ method: axios.delete, url })
}
