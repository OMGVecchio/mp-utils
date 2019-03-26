import Taro from '@tarojs/taro'
import { observable } from 'mobx'

import { SERVER_HTTP } from '../utils/config'
import { SESSION_KEY, USER_INFO } from '../utils/const'

const sessionStore = observable({
  setAuth(param) {
    Taro.request({
      url: `${SERVER_HTTP}/api/wx/auth`,
      method: 'POST',
      data: param,
      dataType: 'json',
    }).then(res => {
      const { data } = res
      if (data.success) {
        Taro.setStorageSync(SESSION_KEY, data.data)
      }
    })
  },
  setUserInfo(detail) {
    Taro.setStorageSync(USER_INFO, detail)
  }
})
export default sessionStore
