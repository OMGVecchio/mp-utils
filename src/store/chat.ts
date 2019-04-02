import { observable } from 'mobx'
import Taro from '@tarojs/taro'

import { CHAT_HISTORY } from '../utils/const'

const chatStore = observable({
  friendsList: [],
  chatMapList: {},
  setFriendsList(friendsList) {
    this.friendsList = friendsList
  },
  setChat(from, chatData) {
    const chatToList = this.chatMapList[from] || []
    const newChatList = chatToList.concat(chatData)
    this.chatMapList = {
      ...this.chatMapList,
      [from]: newChatList
    }
    this.setChatCache(from, chatData)
  },
  setChatCache(from, chatData) {
    const allChatData = this.getChatCache()
    const fromChatData = allChatData[from] || []
    fromChatData.push(chatData)
    allChatData[from] = fromChatData
    Taro.setStorageSync(CHAT_HISTORY, allChatData)
  },
  getChatCache(from) {
    const allChatData = Taro.getStorageSync(CHAT_HISTORY) || {}
    if (from) {
      return allChatData[from] || []
    } else {
      return allChatData
    }
  },
  // todo 先测试历史记录主逻辑
  fillHistory(from, page = 1, pageSize = 10) {
    const allChatData = this.getChatCache()
    const fromChatData = allChatData[from] || []
    const newChatList = this.chatMapList[from] || []
    fromChatData.unshift(newChatList)
    allChatData[from] = fromChatData
    this.chatMapList = {
      ...allChatData
    }
  }
})
export default chatStore
