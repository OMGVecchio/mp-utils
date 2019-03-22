import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import classnames from 'classnames'

import './index.scss'

type PageStateProps = {
  own: boolean,
  data: string,
  title: string,
  isMedia: boolean
}

interface ChatDialog {
  props: PageStateProps
}

class ChatDialog extends Component {

  render () {
    const {
      own,
      data,
      title,
      isMedia
    } = this.props
    return (
      <View className={classnames('chat-dialog', own && 'reverse')}>
        <View className="chat-dialog-avatar">
          <AtAvatar size="small" text={title} />
        </View>
        {
          isMedia ? (
            <Image
              src={data}
              className="chat-dialog-picture"
              mode="widthFix"
              onClick={() => Taro.previewImage({ urls: [data] }) }
            />
          ) : (
            <View className="chat-dialog-text">
              <Text>
                {data}
              </Text>
            </View>
          )
        }
      </View>
    )
  }
}

export default ChatDialog as ComponentType
