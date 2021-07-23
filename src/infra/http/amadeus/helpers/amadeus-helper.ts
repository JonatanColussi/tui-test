import axios, { AxiosInstance } from 'axios'
import env from '../../../../main/config/env'

export default (apiVersion: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${env.amadeus.host}/${apiVersion}`,
    headers: {
      Accept: 'application/json'
    },
    validateStatus: (status) => true
  })

  instance.interceptors.response.use((response) => {
    if (response.status !== 200) {
      throw new Error('Fail to fetch Amadeus api')
    }

    return response.data
  })

  return instance
}
