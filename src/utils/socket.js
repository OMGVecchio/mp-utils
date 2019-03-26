import io from 'weapp.socket.io'
import { SERVER_SOCKET } from './config'

const socket = io(SERVER_SOCKET)

socket.on('connect', () => {
  console.log('连接成功')
})

socket.on('disconnect', () => {
  console.warn('链接中断')
})

socket.on('error', () => {
  console.error('链接异常')
})

export default socket
