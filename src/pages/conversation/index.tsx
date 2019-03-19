import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import {
  View,
  Camera,
  Button,
  Image,
  Video,
  LivePlayer
} from '@tarojs/components'

import './index.scss'

type PageStateProps = {
}

type StateType = {
  photoPath: string,
  recordPath: string,
  isRecording: boolean
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
    isRecording: false
  }

  takePhoto = () => {
    const cameraCtx = Taro.createCameraContext()
    cameraCtx.takePhoto({
      success: (r) => {
        this.setState({ photoPath: r.tempImagePath })
      }
    })
  }

  record = () => {
    const cameraCtx = Taro.createCameraContext()
    const { isRecording } = this.state
    if (isRecording) {
      cameraCtx.stopRecord({
        success: (r) => {
          this.setState({
            recordPath: r.tempVideoPath
          }, () => {
            Taro.createVideoContext('record').play()
          })
        }
      })
    } else {
      cameraCtx.startRecord({})
    }
    this.setState({ isRecording: !isRecording })
  }

  render () {
    return (
      <View className="conversation-page">
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
