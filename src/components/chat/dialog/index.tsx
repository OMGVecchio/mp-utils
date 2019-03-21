import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import classnames from 'classnames'

import './index.scss'

type PageStateProps = {
  own: boolean,
  msg: string,
  title: string
}

interface ChatDialog {
  props: PageStateProps
}

class ChatDialog extends Component {

  render () {
    const {
      own,
      msg,
      title
    } = this.props
    return (
      <View className={classnames('chat-dialog', own && 'reverse')}>
        <View className="chat-dialog-avatar">
          <AtAvatar size="small" text={title} />
        </View>
        <View className="chat-dialog-text">
          <Text>
            {msg}
          </Text>
        </View>
      </View>
    )
  }
}

export default ChatDialog as ComponentType
