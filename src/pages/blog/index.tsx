import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'
import { toJS } from 'mobx'

import './index.scss'

type PageStateProps = {
  blogStore: {
    articleList: [],
    isFetchingList: boolean,
    fetchArticleList: Function
  }
}

interface Blog {
  props: PageStateProps;
}

@inject('blogStore')
@observer
class Blog extends Component {
  config: Config = {
    navigationBarTitleText: '博客'
  }

  componentDidMount () {
    const { blogStore } = this.props
    blogStore.fetchArticleList()
  }

  renderCardList = () => {
    const { blogStore } = this.props
    const cardListHtml = toJS(blogStore.articleList).map(article => {
      const {
        id,
        title,
        desc,
        lastModify
      } = article
      return (
        <AtCard
          note={title}
          extra={lastModify}
          title={title}
          thumb='http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'
        >
          {desc}
        </AtCard>
      )
    })
    return cardListHtml
  }

  render () {
    return (
      <View className="blog">
        {this.renderCardList()}
      </View>
    )
  }
}

export default Blog as ComponentType
