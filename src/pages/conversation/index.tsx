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
import { observer, inject } from '@tarojs/mobx'

import './index.scss'

type PageStateProps = {
  chatStore: {
    friendsList: FriendInfoType[]
  }
}
type StateType = {
  photoPath: string,
  recordPath: string,
  isRecording: boolean,
  friends: string[]
}
export type FriendInfoType = {
  avatarUrl: string,
  city: string,
  country: string,
  gender: number,
  language: string,
  nickName: string,
  province: string,
  openId: string
}
interface Conversation {
  props: PageStateProps;
}

@inject('chatStore')
@observer
class Conversation extends Component {

  config: Config = {
    navigationBarTitleText: '在线列表'
  }

  state: StateType = {
    photoPath: '',
    recordPath: '',
    isRecording: false,
    friends: []
  }

  chatSingle = friendInfo => {
    Taro.navigateTo({ url: `/pages/conversation/room/index?info=${encodeURIComponent(JSON.stringify(friendInfo))}` })
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
    const { friendsList = [] } = this.props.chatStore
    const friendsHTML = friendsList.map(friend => {
      const {
        openId,
        nickName,
        avatarUrl
      } = friend
      return (
        <AtListItem
          key={openId}
          title={nickName}
          thumb={avatarUrl}
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
