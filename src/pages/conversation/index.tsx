import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import {
  View,
  Camera,
  Button,
  Image,
  Video
} from '@tarojs/components'
import { AtList, AtListItem } from "taro-ui"

import socket from '../../utils/socket'

import './index.scss'

type PageStateProps = {
}

type StateType = {
  photoPath: string,
  recordPath: string,
  isRecording: boolean,
  friends: string[]
}

interface Conversation {
  props: PageStateProps;
}

class Conversation extends Component {

  config: Config = {
    navigationBarTitleText: '即时通讯，音视频难搞'
  }

  state: StateType = {
    photoPath: '',
    recordPath: '',
    isRecording: false,
    friends: []
  }

  socket: any = null

  componentDidMount () {
    socket.emit('newMember')
    socket.on('refreshFriendList', friends => {
      console.log('refreshFriendList')
      this.setState({ friends })
    })
  }

  componentWillUnmount () {
    socket.off('refreshFriendList')
  }

  chatSingle = (friendId) => {
    Taro.navigateTo({ url: `/pages/conversation/room/index?id=${friendId}` })
  }

  // takePhoto = () => {
  //   const cameraCtx = Taro.createCameraContext()
  //   cameraCtx.takePhoto({
  //     success: (r) => {
  //       this.setState({ photoPath: r.tempImagePath })
  //     }
  //   })
  // }

  // record = () => {
  //   const cameraCtx = Taro.createCameraContext()
  //   const { isRecording } = this.state
  //   if (isRecording) {
  //     cameraCtx.stopRecord({
  //       success: (r) => {
  //         this.setState({
  //           recordPath: r.tempVideoPath
  //         }, () => {
  //           Taro.createVideoContext('record').play()
  //         })
  //       }
  //     })
  //   } else {
  //     cameraCtx.startRecord({})
  //   }
  //   this.setState({ isRecording: !isRecording })
  // }

  render () {
    const { friends } = this.state
    const friendsHTML = friends.filter(friend => friend !== socket.id).map(friend => {
      return (
        <AtListItem
          title={friend}
          key={friend}
          onClick={() => this.chatSingle(friend) }
        />
      )
    })
    return (
      <View className="conversation-page">
        <AtList>
          {friendsHTML}
        </AtList>
        {/* <Camera
          className="common-style"
          device-position="front"
          flash="off"
        />
        <Button onClick={this.takePhoto}>
          拍摄
        </Button>
        <Button onClick={this.record}>
          {this.state.isRecording ? '结束录像' : '开始录像'}
        </Button>
        <Image
          className="common-style"
          src={this.state.photoPath}
        />
        <Video
          className="common-style"
          id="record"
          src={this.state.recordPath}
        /> */}
      </View>
    )
  }
}

export default Conversation as ComponentType
