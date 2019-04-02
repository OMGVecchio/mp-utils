import Taro from '@tarojs/taro'
import { observable } from 'mobx'

import { SERVER_HTTP } from '../utils/config'
import {
  SESSION_KEY,
  OPENID,
  USER_INFO,
  USER_INFO_RAW
} from '../utils/const'
import { request } from '../utils/request'

const sessionStore = observable({
  setAuth(param) {
    request({
      url: `${SERVER_HTTP}/api/wx/auth`,
      method: 'POST',
      data: param,
      dataType: 'json',
    }).then(res => {
      const { data } = res
      if (data.success) {
        const { data: sessionData } = data
        const { sessionId, openId } = sessionData
        Taro.setStorageSync(SESSION_KEY, sessionId)
        Taro.setStorageSync(OPENID, openId)
      }
    })
  },
  setUserInfo(detail) {
    const { userInfo, rawData, signature } = detail
    Taro.setStorageSync(USER_INFO, userInfo)
    Taro.setStorageSync(USER_INFO_RAW, { rawData, signature })
  }
})
export default sessionStore
