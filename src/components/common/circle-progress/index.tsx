import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'

const defaultColor = '#6FEC6F'

type PageStateProps = {
  max?: number,
  current: number,
  showNumber?: boolean,
  format?: Function,
  color?: string
}

interface CircleProgress {
  props: PageStateProps;
}

class CircleProgress extends Component {

  render() {
    const {
      current = 0,
      showNumber = false,
      format = null,
      color
    } = this.props
    let leftStyle;
    let rightStyle;
    let maskStyle;
    if (current <= 50) {
      leftStyle = { transform: `rotate(${3.6 * current}deg)` }
      rightStyle = { opacity: 0 }
      maskStyle = { opacity: 1 }
    } else {
      leftStyle = { transform: `rotate(180deg)` }
      rightStyle = {
        opacity: 1,
        transform: `rotate(${3.6 * current}deg)`
      }
      maskStyle = { opacity: 0 }
    }
    const showColor = color || defaultColor
    leftStyle.borderColor = showColor
    rightStyle.borderColor = showColor
    return (
      <View className="circle-progress">
        <View className="circle">
          <View className="track" />
          <View className="left transition-rotate" style={leftStyle} />
          <View className="right transition-rotate" style={rightStyle} />
          <View className="mask" style={maskStyle} />
          {
            showNumber && (
              <Text className="hour">
                { format ? format(current) : current }
              </Text>
            )
          }
        </View>
      </View>
    )
  }
}

export default CircleProgress as ComponentType
