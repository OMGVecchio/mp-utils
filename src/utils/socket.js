import io from 'weapp.socket.io'
import Taro from '@tarojs/taro'

import { SERVER_SOCKET } from './config'
import { OPENID, SESSION_KEY, USER_INFO_RAW } from './const'
import chatStore from '../store/chat'

const socket = io(SERVER_SOCKET)

socket.on('connect', () => {
  let maxTry = 20
  const timer = setInterval(() => {
    const sessionId = Taro.getStorageSync(SESSION_KEY)
    const userInfo = Taro.getStorageSync(USER_INFO_RAW)
    const openId = Taro.getStorageSync(OPENID)
    if (sessionId) {
      clearInterval(timer)
      socket.emit('newMember', { sessionId, userInfo, openId })
    }
    if (--maxTry === 0) {
      clearInterval(timer)
      console.error('登录失败')
    }
  }, 500)
})

socket.on('disconnect', () => {
  console.warn('链接中断')
})

socket.on('error', () => {
  console.error('链接异常')
})

socket.on('message', res => {
  chatStore.setChat(res.from, res)
})

socket.on('refreshFriendList', friendsList => {
  chatStore.setFriendsList(friendsList)
})

export default socket
