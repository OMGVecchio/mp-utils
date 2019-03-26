import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'
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
  props: PageStateProps
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
    const cardListHtml = blogStore.articleList.map((article: ArticleDetailType) => {
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
          className="blog-list-item"
          key={id}
          title={title}
          extra={dayjs(lastModify).format('YY-MM-DD HH:mm')}
          note={(tags as []).join(',')}
          thumb='https://rms.zhubajie.com/resource/redirect?key=mobile%2Fdefault%2F%E5%A4%B4%E5%83%8F17.jpg%2Forigine%2F1990662d-d67a-4f85-92bf-73be1dd6d334&s.w=240&s.h=240'
          onClick={() => Taro.navigateTo({ url: `/pages/blog/detail/index?id=${id}` })}
        >
          {desc}
        </AtCard>
      )
    })
    return (
      <View className="blog-page">
        {cardListHtml}
      </View>
    )
  }
}

export default Blog as ComponentType
