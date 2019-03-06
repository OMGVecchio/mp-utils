import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import {
  View,
  Button,
  Text
} from '@tarojs/components'
// import { observer, inject } from '@tarojs/mobx'
import {
  AtGrid,
  AtAvatar
} from 'taro-ui'

import './index.scss'

import calendarIcon from '../../assets/images/index/calendar.png'
import blogIcon from '../../assets/images/index/blog.png'
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
  image: notFoundIcon,
  value: '待开放'
}, {
  image: notFoundIcon,
  value: '待开放'
}, {
  image: notFoundIcon,
  value: '待开放'
}, {
  image: notFoundIcon,
  value: '待开放'
}, {
  image: notFoundIcon,
  value: '待开放'
}, {
  image: notFoundIcon,
  value: '待开放'
}, {
  image: notFoundIcon,
  value: '待开放'
}]

type PageStateProps = {
  // counterStore: {
  //   counter: number,
  //   increment: Function,
  //   decrement: Function,
  //   incrementAsync: Function
  // }
}
type toolItemType = {
  image: string,
  value: string,
  pageUrl?: string
}

interface Index {
  props: PageStateProps;
}

// @inject('counterStore')
// @observer
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

  componentWillMount () { }

  componentWillReact () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // increment = () => {
  //   const { counterStore } = this.props
  //   counterStore.increment()
  // }

  // decrement = () => {
  //   const { counterStore } = this.props
  //   counterStore.decrement()
  // }

  // incrementAsync = () => {
  //   const { counterStore } = this.props
  //   counterStore.incrementAsync()
  // }

  gotoSubPage = (item: toolItemType) => {
    const { pageUrl } = item
    if (pageUrl) {
      Taro.navigateTo({ url: pageUrl })
    }
  }

  render () {
    // const { counterStore: { counter } } = this.props
    return (
      <View className="index">
        <View className="index-header">
          <AtAvatar openData={{ type: 'userAvatarUrl' }} circle />
        </View>
        <AtGrid data={toolDataList} onClick={this.gotoSubPage} />
        {/* <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text> */}
      </View>
    )
  }
}

export default Index as ComponentType
