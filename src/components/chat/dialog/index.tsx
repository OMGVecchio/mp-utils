import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'
import classnames from 'classnames'

import { SERVER_HTTP } from '../../../utils/config'
import { MSG_TEXT, MSG_PICT, MSG_AUDI } from '../../../utils/const'
import { format } from './time'

import './index.scss'

type PageStateProps = {
  own: boolean,
  data: string,
  title: string,
  mediaType: number,
  timestamp: number,
  showTime: boolean,
  avatar: string
}

type StateType = {
  voiceIsStart: boolean,
  voiceDuration: number
}

interface ChatDialog {
  props: PageStateProps
}

class ChatDialog extends Component {

  state: StateType = {
    voiceIsStart: false,
    voiceDuration: 0
  }

  audioCtx: null | Taro.InnerAudioContext = null

  playVoice = voiceUrl => {
    const { audioCtx } = this
    if (audioCtx) {
      if (this.state.voiceIsStart) {
        this.stopVoice()
        return
      }
      audioCtx.src = voiceUrl
      audioCtx.play()
      audioCtx.onCanplay(() => {
        this.setState({ voiceDuration: audioCtx.duration })
      })
    }
  }

  stopVoice = () => {
    const { audioCtx } = this
    if (audioCtx) {
      audioCtx.stop()
      this.setState({ voiceIsStart: false })
    }
  }

  componentDidMount () {
    if (this.props.mediaType === MSG_AUDI) {
      this.audioCtx = Taro.createInnerAudioContext()
    }
  }

  render () {
    const {
      own,
      data,
      mediaType,
      timestamp,
      showTime,
      avatar
    } = this.props

    let dialogHTML
    switch (Number(mediaType)) {
      case MSG_TEXT: {
        dialogHTML = (
          <View className="chat-dialog-text">
            {data}
          </View>
        )
        break
      }
      case MSG_PICT: {
        const thumbPictUrl = `${SERVER_HTTP}/api/pict-tool?pictPath=${encodeURIComponent(data)}&quality=20`
        const fullPictUrl = `${SERVER_HTTP}${data}`
        dialogHTML = (
          <Image
            src={thumbPictUrl}
            className="chat-dialog-pict"
            mode="widthFix"
            onClick={() => Taro.previewImage({ urls: [fullPictUrl] }) }
          />
        )
        break
      }
      default: {
        const voiceUrl = `${SERVER_HTTP}${data}`
        dialogHTML = (
          <View
            className="chat-dialog-text chat-dialog-audi"
            onClick={() => this.playVoice(voiceUrl)}
          >
            {this.state.voiceDuration}''<AtIcon value="volume-plus" />
          </View>
        )
        break
      }
    }

    let dialogTimestamp
    if (showTime) {
      const timeFormat = format(timestamp)
      dialogTimestamp = (
        <View className="chat-dialog-timestamp-wrap">
          <View className="chat-dialog-timestamp">
            {timeFormat}
          </View>
        </View>
      )
    }

    return (
      <View className="chat-dialog-wrap">
       {dialogTimestamp}
        <View className={classnames('chat-dialog', own && 'reverse')}>
          <View className="chat-dialog-avatar">
            <AtAvatar size="small" image={avatar} />
          </View>
          {dialogHTML}
        </View>
      </View>
    )
  }
}

export default ChatDialog as ComponentType
