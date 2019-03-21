import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Input,
  Button
} from '@tarojs/components'

import { getRGBonHueSlider } from './color'

import './index.scss'

const defaultState: StateType = {
  hueTop: 0,
  rgb: [255, 0, 0]
}

type PageStateProps = {

}

type StateType = {
  hueTop: number,
  rgb: number[]
}

interface ColorPicker {
  props: PageStateProps
}

class ColorPicker extends Component {

  state: StateType = defaultState

  hueSliderClick = e => {
    const { y, offsetTop } = e.target
    const relativeTop = y - offsetTop
    console.log(relativeTop)
    const rgbArr = getRGBonHueSlider(relativeTop, 109)
    this.setState({
      hueTop: relativeTop,
      rgb: rgbArr
    })
  }

  hueSliderMove = e => {
    const { offsetTop } = e.target
    const { clientY } = e.changedTouches[0]
    const relativeTop = clientY - offsetTop
    const rgbArr = getRGBonHueSlider(relativeTop, 109)
    this.setState({
      hueTop: relativeTop,
      rgb: rgbArr
    })
  }

  hexFormat = (numberArr: number[] = []): string => {
    let hexString = ''
    numberArr.forEach(number => hexString += number < 10 ? `0${number}` : number.toString(16))
    return hexString
  }

  clear = () => {
    this.setState({ ...defaultState })
  }

  confirm = () => {

  }

  render() {
    const {
      hueTop,
      rgb
    } = this.state
    const hexRgb = this.hexFormat(rgb)
    const sbStyle = {
      backgroundColor: `#${hexRgb}`
    }
    const hueStyle = { top: `${hueTop}px` }
    return (
      <View className="color-picker">
        <View className="color-panel">
          <View className="color-sb-panel" style={sbStyle}>
            <View className="color-saturation-panel" />
            <View className="color-brightness-panel" />
            <View className="color-sb-cursor" />
          </View>
          <View
            className="color-hue-slider"
            onClick={this.hueSliderClick}
            onTouchMove={this.hueSliderMove}
          >
            <View className="color-hue-slider-bar" style={hueStyle} />
          </View>
        </View>
        <View>
          <Input value={`#${hexRgb}`} />
          <View>
            <Button onClick={this.clear}>
              清除
            </Button>
            <Button onClick={this.confirm}>
              确认
            </Button>
          </View>
        </View>
      </View>
    )
  }
}

export default ColorPicker as ComponentType
