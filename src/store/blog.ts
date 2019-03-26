import Taro from '@tarojs/taro'
import { observable } from 'mobx'

import { SERVER_HTTP } from '../utils/config'

const blogStore = observable({
  articleList: [],
  isFetchingList: false,
  articleDetail: {},
  isFetchingDetail: false,
  fetchArticleList() {
    if (this.articleList.length > 0) {
      return
    }
    this.isFetchingList = true
    Taro.request({
      url: `${SERVER_HTTP}/api/article`,
      dataType: 'JSON',
      complete: () => {
        this.isFetchingList = false
      }
    }).then(result => {
      this.articleList = JSON.parse(result.data).data
    }).catch(e => {
      console.error(e)
    })
  },
  fetchArticleDetail(articleId) {
    if (this.articleDetail[articleId]) {
      return
    }
    this.isFetchingDetail = true
    Taro.request({
      url: `${SERVER_HTTP}/api/article/${articleId}`,
      dataType: 'JSON',
      complete: () => {
        this.isFetchingList = false
      }
    }).then(result => {
      this.articleDetail = {
        ...this.articleDetail,
        [articleId]: JSON.parse(result.data).data
      }
    }).catch(e => {
      console.error(e)
    })
  }
})
export default blogStore
