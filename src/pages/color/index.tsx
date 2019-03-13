import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

import CircleProgress from '../../components/common/circle-progress'

import colorData from './data.json'
import './index.scss'

const CMYK_CONFIG = [{
  type: 'C',
  color: '#0093D3'
}, {
  type: 'M',
  color: '#CC006B'
}, {
  type: 'Y',
  color: '#FFF10C'
}, {
  type: 'K',
  color: '#333333'
}]
const RGB_CONFIG = [{
  type: 'R',
  color: 'red'
}, {
  type: 'G',
  color: 'green'
}, {
  type: 'B',
  color: 'blue'
}]

type PageStateProps = {
}

type ColorItemType = {
  CMYK: number[],
  RGB: number[],
  hex: string,
  name: string,
  pinyin: string
}

type StateType = {
  color: ColorItemType
}

interface Color {
  props: PageStateProps;
}

class Color extends Component {

  state: StateType = {
    color: colorData[0]
  }

  config: Config = {
    navigationBarTitleText: '中国色'
  }

  setTitle = (title) => {
    const showTitle = title || '中国色'
    Taro.setNavigationBarTitle({ title: showTitle })
  }

  modifyColor = (color: ColorItemType) => {
    this.setState({ color })
    this.setTitle(color.name)
  }

  componentDidMount () {
    this.setTitle(this.state.color.name)
  }

  render () {
    const {
      CMYK,
      RGB
    } = this.state.color
    const cmykItemList = CMYK.map((item, index) => {
      return (
        <View key={item} className="color-cmyk-item">
          <CircleProgress
            current={item}
            showNumber={true}
            color={CMYK_CONFIG[index].color}
          />
        </View>
      )
    })
    const rgbItemList = RGB.map((item, index) => {
      return (
        <View
          key={item}
          className="color-rgb-item"
          style={{color: RGB_CONFIG[index].color}}
        >
          {RGB_CONFIG[index].type}:{item}
        </View>
      )
    })
    const colorItemList = colorData.map((color: ColorItemType) => {
      const {
        hex,
        name,
        pinyin,
        CMYK,
        RGB
      } = color
      return (
        <View className="color-item" key={hex} onClick={() => this.modifyColor(color)}>
          <View className="color-show" style={`background-color: ${hex}`} />
          <View className="color-name">{name}</View>
        </View>
      )
    })
    return (
      <View className="color">
        <View className="color-select-wrap">
          <View className="color-cmyk-wrap">
            {cmykItemList}
          </View>
          <View className="color-rgb-wrap">
            {rgbItemList}
          </View>
        </View>
        <View className="color-list" style={{backgroundColor: this.state.color.hex}}>
          {colorItemList}
        </View>
      </View>
    )
  }
}

export default Color as ComponentType
