import io from 'weapp.socket.io'

const socket =  io('ws://192.168.31.18:3000')

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
