import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView, View, Image, Textarea, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import ChatDialog from '../../../components/chat/dialog'
import EmojiPanel from '../../../components/chat/emoji'

import bgImg from '../../../assets/images/chat/bg.jpg'
import socket from '../../../utils/socket'
import { SERVER_HTTP } from '../../../utils/config'
import {
  MSG_TEXT,
  MSG_PICT,
  MSG_AUDI
} from '../../../utils/const'

import './index.scss'

type PageStateProps = {
}

type StateType = {
  msg: string,
  showIcon: boolean,
  msgIsCommon: boolean,
  isRecordIng: boolean,
  currentDialogId: string,
  history: {
    title: string,
    data: string,
    mediaType: number,
    own: boolean,
    timestamp: number
  }[]
}

interface ChatSingle {
  props: PageStateProps;
}

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
    history: []
  }

  recordStartTimestamp: null | number = null

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: this.$router.params.id })
    socket.on('single-message', res => {
      const {
        data,
        mediaType = 1,
        from,
        timestamp = Date.now()
      } = res
      this.setState({
        currentDialogId: this.getDialogIdTag(timestamp),
        history: this.state.history.concat({
          title: from,
          data,
          mediaType,
          own: false,
          timestamp
        })
      })
    })
  }

  componentWillUnmount () {
    socket.off('single-message')
  }

  getDialogIdTag = timestamp => `id${timestamp}`

  changeMsg = e => {
    const { value: msg } = e.target
    this.setState({ msg })
  }

  sendMsg = () => {
    const { msg } = this.state
    const to = this.$router.params.id
    const own = true
    const timestamp = Date.now()
    const param = {
      msg,
      to,
      timestamp,
      mediaType: MSG_TEXT
    }
    socket.emit('single-message', param)
    this.setState({
      msg: '',
      currentDialogId: this.getDialogIdTag(timestamp),
      history: this.state.history.concat({
        title: to,
        data: msg,
        mediaType: MSG_TEXT,
        own,
        timestamp
      })
    })
  }

  uploadData = (filePath, mediaType) => {
    Taro.uploadFile({
      url: `${SERVER_HTTP}/api/socket/msg/media`,
      name: 'media',
      formData: {
        to: this.$router.params.id,
        from: socket.id,
        mediaType
      },
      filePath: filePath,
      success: ({ data }) => {
        const dataJson = JSON.parse(data)
        const { data: imgUrl } = dataJson
        const timestamp = Date.now()
        this.setState({
          currentDialogId: this.getDialogIdTag(timestamp),
          history: this.state.history.concat({
            title: this.$router.params.id,
            data: imgUrl,
            mediaType,
            own: true,
            timestamp
          })
        })
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
    const { showIcon, msg, msgIsCommon, isRecordIng } = this.state
    const chatDialogHTML = this.state.history.map(dialogItem => {
      const {
        title,
        data,
        mediaType,
        own,
        timestamp
      } = dialogItem
      return (
        <ChatDialog
          id={this.getDialogIdTag(timestamp)}
          key={timestamp}
          title={title}
          own={own}
          data={String(data)}
          mediaType={mediaType}
          timestamp={timestamp}
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
            <AtIcon value={msgIsCommon ? 'message' : 'phone'} />
          </View>
          <View className="conversation-input">
            {
              msgIsCommon ? (
                <Textarea
                  className="conversation-input-msg"
                  onInput={this.changeMsg}
                  value={msg}
                  autoHeight={true}
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
              className="conversation-option-emoji conversation-option-item"
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
                <AtIcon value="add-circle" onClick={this.sendFile} />
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
