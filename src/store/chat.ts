import { observable } from 'mobx'
import Taro from '@tarojs/taro'

import { CHAT_HISTORY } from '../utils/const'

const chatStore = observable({
  friendsList: [],
  chatMapList: {},
  setFriendsList(friendsList) {
    this.friendsList = friendsList
  },
  setChat(roomId, chatData) {
    const chatList = this.chatMapList[roomId] || []
    const newChatList = chatList.concat(chatData)
    this.chatMapList = {
      ...this.chatMapList,
      [roomId]: newChatList
    }
    this.setChatCache(roomId, chatData)
  },
  setChatCache(roomId, chatData) {
    const allChatHistory = this.getChatCache()
    const roomChatHistory = allChatHistory[roomId] || []
    roomChatHistory.push(chatData)
    allChatHistory[roomId] = roomChatHistory
    Taro.setStorageSync(CHAT_HISTORY, allChatHistory)
  },
  getChatCache(roomId) {
    const allChatHistory = Taro.getStorageSync(CHAT_HISTORY) || {}
    if (roomId) {
      return allChatHistory[roomId] || []
    } else {
      return allChatHistory
    }
  },
  fillChatDataWithHistory() {
    const allChatHistory = this.getChatCache()
    this.chatMapList = {
      ...allChatHistory
    }
  }
})
export default chatStore
