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

import './index.scss'

type PageStateProps = {
  own: boolean,
  data: string,
  title: string,
  mediaType: number
}

type StateType = {
  voiceDuration: number
}

interface ChatDialog {
  props: PageStateProps
}

class ChatDialog extends Component {

  playVoice = voiceUrl => {
    const ac = Taro.createInnerAudioContext()
    ac.src = voiceUrl
    ac.play()
    ac.onCanplay(() => {
      this.setState({ voiceDuration: ac.duration })
    })
  }

  state: StateType = {
    voiceDuration: 0
  }

  render () {
    const {
      own,
      data,
      title,
      mediaType
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
          <View className="chat-dialog-audi" onClick={() => this.playVoice(data)}>
              {this.state.voiceDuration}''<AtIcon value="volume-plus" />
          </View>
        )
        break
      }
    }
    return (
      <View className={classnames('chat-dialog', own && 'reverse')}>
        <View className="chat-dialog-avatar">
          <AtAvatar size="small" text={title} />
        </View>
        {dialogHTML}
      </View>
    )
  }
}

export default ChatDialog as ComponentType
