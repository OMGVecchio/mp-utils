import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'
import { toJS } from 'mobx'
import dayjs from 'dayjs'

import './index.scss'

import { ArticleDetailType } from './detail/index'

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

  render () {
    const { blogStore } = this.props

    const cardListHtml = toJS(blogStore.articleList).map((article: ArticleDetailType) => {
      const {
        id,
        title,
        desc,
        lastModify,
        tags,
        online
      } = article
      if (!online) {
        return null
      }
      return (
        <AtCard
          title={title}
          extra={dayjs(lastModify).format('YY-MM-DD HH:mm')}
          note={(tags as []).join(',')}
          thumb='http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'
          onClick={() => Taro.navigateTo({ url: `/pages/blog/detail/index?id=${id}` })}
        >
          {desc}
        </AtCard>
      )
    })
    return (
      <View className="blog">
        {cardListHtml}
      </View>
    )
  }
}

export default Blog as ComponentType
