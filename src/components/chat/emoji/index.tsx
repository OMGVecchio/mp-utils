import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { ScrollView, Text } from '@tarojs/components'

import emojiMap from './emoji.json'

import './index.scss'

const emojiList = Object.keys(emojiMap)

type PageStateProps = {
  select: Function
}

type StateType = {
}

interface ChatSingle {
  props: PageStateProps;
}

class ChatSingle extends Component {

  state: StateType = {
  }

  render () {
    const { select = () => {} } = this.props
    const emojiHTML = emojiList.map(emoji => {
      return (
        <Text
          className="emoji-item"
          key={emoji}
          onClick={() => select(emojiMap[emoji], emoji)}
        >
          {emojiMap[emoji]}
        </Text>
      )
    })
    return (
      <ScrollView className="emoji-panel" scrollY>
        {emojiHTML}
      </ScrollView>
    )
  }
}

export default ChatSingle as ComponentType
