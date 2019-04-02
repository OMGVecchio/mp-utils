import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView, View, Image, Textarea, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'

import ChatDialog from '../../../components/chat/dialog'
import EmojiPanel from '../../../components/chat/emoji'

import bgImg from '../../../assets/images/chat/bg.jpg'
import socket from '../../../utils/socket'
import { SERVER_HTTP } from '../../../utils/config'
import {
  MSG_TEXT,
  MSG_PICT,
  MSG_AUDI,
  OPENID
} from '../../../utils/const'

import './index.scss'

import { FriendInfoType } from '../index'
type PageStateProps = {
  chatStore: {
    chatMapList: {
      [to: string]: HistoryType[]
    },
    setChat: Function,
    fillHistory: Function
  }
}
type StateType = {
  msg: string,
  showIcon: boolean,
  msgIsCommon: boolean,
  isRecordIng: boolean,
  currentDialogId: string,
  friendInfo: {} | FriendInfoType,
  openId: string
}
export type HistoryType = {
  title: string,
  data: string,
  mediaType: number,
  timestamp: number,
  avatar: string
}
interface ChatSingle {
  props: PageStateProps
}

@inject('chatStore')
@observer
class ChatSingle extends Component {

  config: Config = {
    navigationBarTitleText: '载入中'
  }

  state: StateType = {
    msg: '',
    showIcon: false,
    msgIsCommon: true,
    isRecordIng: false,
    currentDialogId: '',
    friendInfo: {},
    openId: ''
  }

  recordStartTimestamp: null | number = null

  componentDidMount () {
    const friendInfo = (JSON.parse(decodeURIComponent(this.$router.params.info))) as FriendInfoType
    const openId = Taro.getStorageSync(OPENID)
    this.props.chatStore.fillHistory(friendInfo.openId)
    this.setState({
      friendInfo,
      openId
    })
    Taro.setNavigationBarTitle({ title: friendInfo.nickName })
  }

  getDialogIdTag = timestamp => `id${timestamp}`

  changeMsg = e => {
    const { value: msg } = e.target
    this.setState({ msg })
  }

  sendMsg = () => {
    const { msg, friendInfo } = this.state
    const { openId: to, avatarUrl } = friendInfo as FriendInfoType
    const timestamp = Date.now()
    const param = {
      msg,
      to,
      timestamp,
      mediaType: MSG_TEXT,
      avatar: avatarUrl
    }
    socket.emit('message', param)
    this.setState({
      msg: '',
      currentDialogId: this.getDialogIdTag(timestamp)
    })
  }

  uploadData = (filePath, mediaType) => {
    const { friendInfo, openId } = this.state
    const { openId: to, avatarUrl } = friendInfo as FriendInfoType
    Taro.uploadFile({
      url: `${SERVER_HTTP}/api/socket/msg/media`,
      name: 'media',
      formData: {
        to,
        from: openId,
        mediaType,
        avatar: avatarUrl
      },
      filePath: filePath,
      success: () => {
        const timestamp = Date.now()
        this.setState({ currentDialogId: this.getDialogIdTag(timestamp) })
        if (mediaType === MSG_TEXT) {
          this.setState({ msg: '' })
        }
      }
    })
  }

  sendFile = () => {
    // TODO: chooseImage param type error
    Taro.chooseImage({
      count: 9,
      success: ({ tempFilePaths }) => {
        this.uploadData(tempFilePaths[0], MSG_PICT)
      }
    } as any)
  }

  recordStart = () => {
    Taro.getRecorderManager().start({})
    this.recordStartTimestamp = Date.now()
    this.setState({ isRecordIng: true })
  }

  recordStop = () => {
    this.setState({ isRecordIng: false })
    if (this.recordStartTimestamp) {
      const duration = Date.now() - this.recordStartTimestamp
      this.recordStartTimestamp = 0
      if (duration < 500) {
        return
      }
      Taro.getRecorderManager().onStop(({ tempFilePath }) => {
        this.uploadData(tempFilePath, MSG_AUDI)
      })
      Taro.getRecorderManager().stop()
    }
  }

  selectEmoji = emoji => {
    this.setState({ msg: `${this.state.msg}${emoji}` })
  }

  render () {
    const {
      showIcon,
      msg,
      msgIsCommon,
      isRecordIng,
      friendInfo,
      openId
    } = this.state
    const { chatStore: { chatMapList } } = this.props
    const { openId: fromOpenId } = friendInfo as FriendInfoType
    const chatList = chatMapList[openId] || []
    const chatDialogHTML = chatList.map((dialogItem, index) => {
      const {
        title,
        data,
        mediaType,
        timestamp,
        avatar
      } = dialogItem
      const showTime = index === 0
        ? true
        : (timestamp - chatList[index - 1].timestamp > 1000 * 60 * 5)
      return (
        <ChatDialog
          id={this.getDialogIdTag(timestamp)}
          key={timestamp}
          title={title}
          own={openId === fromOpenId}
          data={String(data)}
          mediaType={mediaType}
          timestamp={timestamp}
          showTime={showTime}
          avatar={avatar}
        />
      )
    })
    return (
      <View className="conversation-page">
        <Image src={bgImg} className="conversation-bg" />
        <ScrollView
          scrollY
          scrollIntoView={this.state.currentDialogId}
          scrollWithAnimation={true}
          className="conversation-dialog-panel"
          onClick={ () => showIcon && this.setState({ showIcon: false }) }
        >
          {chatDialogHTML}
        </ScrollView>
        <View className="conversation-option-panel">
          <View className="conversation-type" onClick={() => this.setState({ msgIsCommon: !msgIsCommon })}>
            <AtIcon className="conversation-icon" value={msgIsCommon ? 'message' : 'phone'} />
          </View>
          <View className="conversation-input">
            {
              msgIsCommon ? (
                <Textarea
                  cursor-spacing={'35rpx'}
                  className="conversation-input-msg"
                  onInput={this.changeMsg}
                  value={msg}
                  autoHeight={true}
                  showConfirmBar={false}
                  maxlength={-1}
                />
              ) : (
                <View
                  className="conversation-input-record"
                  onTouchStart={this.recordStart}
                  onTouchEnd={this.recordStop}
                >
                  {isRecordIng ? '松开 结束' : '按住 说话'}
                </View>
              )
            }
          </View>
          <View className="conversation-option">
            <AtIcon
              value="image"
              className="conversation-icon conversation-option-item"
              onClick={() => this.setState({ showIcon: true })}
            />
            {
              msg ? (
                <Button
                  className="conversation-option-send conversation-option-item"
                  onClick={this.sendMsg}
                >
                  发送
                </Button>
              ) : (
                <AtIcon
                  className="conversation-icon"
                  value="add-circle"
                  onClick={this.sendFile}
                />
              )
            }
          </View>
        </View>
        {
          showIcon && (
            <EmojiPanel select={emoji => this.selectEmoji(emoji)} />
          )
        }
      </View>
    )
  }
}

export default ChatSingle as ComponentType
