import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView, View, Image, Input, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import ChatDialog from '../../../components/chat/dialog'
import EmojiPanel from '../../../components/chat/emoji'

import socket from '../../../utils/socket'
import bgImg from '../../../assets/images/chat/bg.jpg'

import './index.scss'

type PageStateProps = {
}

type StateType = {
  msg: string,
  showIcon: boolean,
  history: {
    title: string,
    msg: string,
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
    history: []
  }

  componentDidMount () {
    socket.on('single-message', data => {
      const { msg, from } = data
      this.setState({
        history: this.state.history.concat({
          title: from,
          msg,
          own: false,
          timestamp: Date.now()
        })
      })
    })
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
      to
    }
    socket.emit('single-message', param)
    this.setState({
      msg: '',
      history: this.state.history.concat({
        title: to,
        msg,
        own,
        timestamp: Date.now()
      })
    })
  }

  sendFile = () => {
    // Taro.chooseImage({
    //   count: 9,
    //   success: (r) => {
    //     console.log(r)
    //   }
    // })
  }

  selectEmoji = emoji => {
    this.setState({ msg: `${this.state.msg}${emoji}` })
  }

  render () {
    const { showIcon } = this.state
    const chatDialogHTML = this.state.history.map(dialogItem => {
      const {
        title,
        msg,
        own,
        timestamp
      } = dialogItem
      return (
        <ChatDialog
          key={timestamp}
          title={title}
          own={own}
          msg={String(msg)}
        />
      )
    })
    return (
      <View className="conversation-single-page">
        <Image src={bgImg} className="conversation-bg" />
        <ScrollView
          scrollY
          className="conversation-dialog-panel"
          onClick={ () => showIcon && this.setState({ showIcon: false }) }
        >
          {chatDialogHTML}
        </ScrollView>
        <View className="conversation-option-panel">
          <Input
            className="conversation-input"
            onInput={this.changeMsg}
            value={this.state.msg}
          />
          <View className="conversation-option">
            <AtIcon value="image" onClick={() => this.setState({ showIcon: true })}/>
            {
              this.state.msg ? (
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
