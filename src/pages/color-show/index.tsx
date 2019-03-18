import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import ColorPicker from '../../components/common/color-picker'

import './index.scss'

type PageStateProps = {

}

interface ColorShow {
  props: PageStateProps;
}

class ColorShow extends Component {

  config: Config = {
    navigationBarTitleText: '颜色选择'
  }

  render () {
    return (
      <View className="colorshow-page">
        <ColorPicker />
      </View>
    )
  }
}

export default ColorShow as ComponentType
