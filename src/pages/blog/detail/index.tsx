import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'
import { toJS } from 'mobx'
import dayjs from 'dayjs'

import './index.scss'

type PageStateProps = {
  blogStore: {
    articleDetail: [],
    isFetchingDetail: boolean,
    fetchArticleDetail: Function
  }
}

export type ArticleDetailType = {
  id: string,
  title: string,
  cover: string,
  desc: string,
  article: string,
  createTime: number,
  lastModify: number,
  tags: string[],
  online: boolean
}

interface ArticleDetail {
  props: PageStateProps;
}

@inject('blogStore')
@observer
class ArticleDetail extends Component {
  config: Config = {
    navigationBarTitleText: '详情'
  }

  componentDidMount () {
    const { blogStore } = this.props
    const { id } = this.$router.params
    blogStore.fetchArticleDetail(id)
  }

  render () {
    const { blogStore } = this.props
    const { articleDetail } = blogStore
    const articleDetailObj = toJS(articleDetail) as any
    const {
      cover,
      title,
      createTime,
      desc,
      article
    } = articleDetailObj as ArticleDetailType
    // console.log(blogStore.get('articleDetail'))
    console.log(title)
    console.log(desc)
    console.log(article)
    return (
      <View className="article-detail at-article">
        <Image src={cover} mode="widthFix" className="at-article__img" />
        <View className='at-article__h1'>
          <Text>{title}</Text>
        </View>
        <View className="at-article__info">
          {dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')}
        </View>
        <View className="at-article__info">
          <Text>{desc}</Text>
        </View>
        <View className="at-article__p">
          <Text>{article}</Text>
        </View>
      </View>
    )
  }
}

export default ArticleDetail as ComponentType
