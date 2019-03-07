import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import dayjs from 'dayjs'

import Markdown from '../../../components/common/markdown'

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

  componentDidMount() {
    const { blogStore } = this.props
    const { id } = this.$router.params
    blogStore.fetchArticleDetail(id)
  }

  render() {
    const { blogStore } = this.props
    const { id } = this.$router.params
    const articleDetail = blogStore.articleDetail[String(id)]
    if (!articleDetail) {
      return null
    }
    const {
      cover = '',
      title = '',
      createTime = 0,
      desc = '',
      article = ''
    } = articleDetail as ArticleDetailType
    return (
      <View className="article-detail at-article">
        <Image src={`${blogDomain}${cover || '/images/other/404.jpg'}`} mode="aspectFill" className="article-cover" />
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
          <Markdown source={article} />
        </View>
      </View>
    )
  }
}

export default ArticleDetail as ComponentType
