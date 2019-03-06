import Taro from '@tarojs/taro'
import { observable } from 'mobx'

const blogStore = observable({
  articleList: [],
  isFetchingList: false,
  articleDetail: {},
  isFetchingDetail: false,
  fetchArticleList() {
    this.isFetchingList = true
    Taro.request({
      url: 'https://vecchio.top/api/article',
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
    this.isFetchingDetail = true
    Taro.request({
      url: `https://vecchio.top/api/article/${articleId}`,
      dataType: 'JSON',
      complete: () => {
        this.isFetchingList = false
      }
    }).then(result => {
      this.articleDetail[articleId] = JSON.parse(result.data).data
    }).catch(e => {
      console.error(e)
    })
  }
})
export default blogStore
