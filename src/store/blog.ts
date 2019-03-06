import Taro from '@tarojs/taro'
import { observable } from 'mobx'

const blogStore = observable({
  articleList: [],
  isFetchingList: false,
  fetchArticleList() {
    Taro.request({
      url: 'https://vecchio.top/api/article',
      dataType: 'JSON'
    }).then(result => {
      this.articleList = JSON.parse(result.data).data
    }).catch(e => {
      console.error(e)
    })
  }
})
export default blogStore
