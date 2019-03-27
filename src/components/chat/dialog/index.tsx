import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'
import classnames from 'classnames'

import {
  MSG_TEXT,
  MSG_PICT,
  MSG_AUDI
} from '../../../utils/const'
import { format } from './time'

import './index.scss'

type PageStateProps = {
  own: boolean,
  data: string,
  title: string,
  mediaType: number,
  timestamp: number
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
        this.setState({
          voiceDuration: audioCtx.duration
        })
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
      title,
      mediaType,
      timestamp
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
        dialogHTML = (
          <Image
            src={data}
            className="chat-dialog-pict"
            mode="widthFix"
            onClick={() => Taro.previewImage({ urls: [data] }) }
          />
        )
        break
      }
      default: {
        dialogHTML = (
          <View
            className="chat-dialog-text chat-dialog-audi"
            onClick={() => this.playVoice(data)}
          >
            {this.state.voiceDuration}''<AtIcon value="volume-plus" />
          </View>
        )
        break
      }
    }

    let dialogTimestamp
    if (timestamp) {
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
            <AtAvatar size="small" text={title} />
          </View>
          {dialogHTML}
        </View>
      </View>
    )
  }
}

export default ChatDialog as ComponentType
