import Taro from '@tarojs/taro'

import { SESSION_KEY } from '../utils/const'

export const request = param => {
  const { header = {} } = param
  header['auth_token'] = Taro.getStorageSync(SESSION_KEY)
  const newParam = Object.assign({}, param, { header })
  return Taro.request(newParam)
}

export default request
