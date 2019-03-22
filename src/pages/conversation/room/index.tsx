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
    data: string,
    isMedia: boolean,
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
    Taro.setNavigationBarTitle({ title: this.$router.params.id })
    socket.on('single-message', res => {
      const {
        data,
        isMedia,
        from
      } = res
      this.setState({
        history: this.state.history.concat({
          title: from,
          data,
          isMedia,
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
      to
    }
    socket.emit('single-message', param)
    this.setState({
      msg: '',
      history: this.state.history.concat({
        title: to,
        data: msg,
        isMedia: false,
        own,
        timestamp: Date.now()
      })
    })
  }

  sendFile = () => {
    // TODO: chooseImage param type error
    Taro.chooseImage({
      count: 9,
      success: r => {
        const { tempFilePaths } = r
        Taro.uploadFile({
          url: 'http://127.0.0.1:3000/api/socket/msg/media',
          name: 'media',
          formData: {
            to: this.$router.params.id,
            from: socket.id
          },
          filePath: tempFilePaths[0],
          success: ({ data }) => {
            const dataJson = JSON.parse(data)
            const { data: imgUrl } = dataJson
            this.setState({
              history: this.state.history.concat({
                title: this.$router.params.id,
                data: imgUrl,
                isMedia: true,
                own: true,
                timestamp: Date.now()
              })
            })
          }
        })
      }
    } as any)
  }

  selectEmoji = emoji => {
    this.setState({ msg: `${this.state.msg}${emoji}` })
  }

  render () {
    const { showIcon } = this.state
    const chatDialogHTML = this.state.history.map(dialogItem => {
      const {
        title,
        data,
        isMedia,
        own,
        timestamp
      } = dialogItem
      return (
        <ChatDialog
          key={timestamp}
          title={title}
          own={own}
          data={String(data)}
          isMedia={isMedia}
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
