import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import {
  AtGrid,
  AtAvatar
} from 'taro-ui'

import { SESSION_KEY, USER_INFO } from '../../utils/const'

import './index.scss'

import calendarIcon from '../../assets/images/index/calendar.png'
import blogIcon from '../../assets/images/index/blog.png'
import resumeIcon from '../../assets/images/index/resume.png'
import colorIcon from '../../assets/images/index/color.png'
import filterIcon from '../../assets/images/index/filter.png'
import colorPickerIcon from '../../assets/images/index/picker.png'
import conversationIcon from '../../assets/images/index/conversation.png'
import notFoundIcon from '../../assets/images/index/404.png'

const toolDataList = [{
  image: calendarIcon,
  pageUrl: '/pages/appointment/index',
  value: '行程安排'
}, {
  image: blogIcon,
  pageUrl: '/pages/blog/index',
  value: '博客'
}, {
  image: resumeIcon,
  pageUrl: '/pages/resume/index',
  value: '简历'
}, {
  image: colorIcon,
  pageUrl: '/pages/color/index',
  value: '中国色'
}, {
  image: filterIcon,
  pageUrl: '/pages/filter/index',
  value: '滤镜'
}, {
  image: colorPickerIcon,
  pageUrl: '/pages/color-show/index',
  value: '颜色选择器'
}, {
  image: conversationIcon,
  pageUrl: '/pages/conversation/index',
  value: '即时通讯'
}, {
  image: notFoundIcon,
  value: '待开放'
}, {
  image: notFoundIcon,
  value: '待开放'
}]

type PageStateProps = {
  sessionStore: {
    setAuth: Function,
    setUserInfo: Function
  }
}
type StateType = {
  hasLogin: boolean
}
type toolItemType = {
  image: string,
  value: string,
  pageUrl?: string
}

interface Index {
  props: PageStateProps;
}

@inject('sessionStore')
@observer
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  state: StateType = {
    hasLogin: false
  }

  componentWillMount () { }

  componentWillReact () { }

  componentDidMount () {
    const { sessionStore } = this.props
    if (!Taro.getStorageSync(SESSION_KEY)) {
      Taro.login({ success: ({ code }) => sessionStore.setAuth({ code }) })
    }
    const userInfo = Taro.getStorageSync(USER_INFO)
    if (userInfo) {
      this.setState({ hasLogin: true })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  gotoSubPage = (item: toolItemType) => {
    const { pageUrl } = item
    if (pageUrl) {
      Taro.navigateTo({ url: pageUrl })
    }
  }

  getUserInfo = userInfo => {
    const { sessionStore } = this.props
    sessionStore.setUserInfo(userInfo.detail.userInfo)
    this.setState({ hasLogin: true })
  }

  render () {
    return (
      <View className="index-page">
        <View className="index-header">
          <AtAvatar openData={{ type: 'userAvatarUrl' }} circle />
          {
            !this.state.hasLogin && (
              <Button
                className="authorization-btn"
                size="mini"
                openType="getUserInfo"
                onGetUserInfo={this.getUserInfo}
              >
                点击授权
              </Button>
            )
          }
        </View>
        <AtGrid data={toolDataList} onClick={this.gotoSubPage} />
      </View>
    )
  }
}

export default Index as ComponentType
