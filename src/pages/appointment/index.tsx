import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCalendar } from 'taro-ui'

import './index.scss'

type PageStateProps = {

}

interface Appointment {
  props: PageStateProps;
}

class Appointment extends Component {

  config: Config = {
    navigationBarTitleText: '日期安排'
  }

  clickDate = (date) => {
    console.log(date)
  }

  longClickDate = (date) => {
    console.log(date)
  }

  render () {
    return (
      <View className="appointment">
        <AtCalendar
          isVertical
          onDayClick={this.clickDate}
          onDayLongClick={this.longClickDate}
        />
      </View>
    )
  }
}

export default Appointment as ComponentType
