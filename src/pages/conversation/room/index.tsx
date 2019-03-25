import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView, View, Image, Input, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import ChatDialog from '../../../components/chat/dialog'
import EmojiPanel from '../../../components/chat/emoji'

import bgImg from '../../../assets/images/chat/bg.jpg'
import socket from '../../../utils/socket'
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
    history: []
  }

  recordStartTimestamp: null | number = null

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: this.$router.params.id })
    socket.on('single-message', res => {
      const {
        data,
        mediaType,
        from
      } = res
      this.setState({
        history: this.state.history.concat({
          title: from,
          data,
          mediaType,
          own: false,
          timestamp: Date.now()
        })
      })
    })
  }

  componentWillUnmount () {
    socket.off('single-message')
  }

  changeMsg = e => {
    const { value: msg } = e.target
    this.setState({ msg })
  }

  sendMsg = () => {
    const { msg } = this.state
    const to = this.$router.params.id
    const own = true
    const param = {
      msg,
      to,
      mediaType: MSG_TEXT
    }
    socket.emit('single-message', param)
    this.setState({
      msg: '',
      history: this.state.history.concat({
        title: to,
        data: msg,
        mediaType: MSG_TEXT,
        own,
        timestamp: Date.now()
      })
    })
  }

  uploadData = (filePath, mediaType) => {
    Taro.uploadFile({
      url: 'http://127.0.0.1:3000/api/socket/msg/media',
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
        this.setState({
          history: this.state.history.concat({
            title: this.$router.params.id,
            data: imgUrl,
            mediaType,
            own: true,
            timestamp: Date.now()
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
          key={timestamp}
          title={title}
          own={own}
          data={String(data)}
          mediaType={mediaType}
        />
      )
    })
    return (
      <View className="conversation-page">
        <Image src={bgImg} className="conversation-bg" />
        <ScrollView
          scrollY
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
                <Input className="conversation-input-msg" onInput={this.changeMsg} value={msg} />
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
            <AtIcon value="image" onClick={() => this.setState({ showIcon: true })}/>
            {
              msg ? (
                <Button onClick={this.sendMsg} className="conversation-option-send">
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
