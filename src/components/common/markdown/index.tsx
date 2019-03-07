import Taro, { Component } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import marked from 'marked'
// import { wxParse } from '../wxParse/wxParse'

// import hljs from 'highlight.js'

// hljs.configure({
//   tabReplace: '  ',
//   classPrefix: 'hljs-',
//   languages: ['CSS', 'HTML, XML', 'JavaScript', 'PHP', 'Python', 'Stylus', 'TypeScript', 'Markdown']
// })
marked.setOptions({
  // highlight: code => hljs.highlightAuto(code).value,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

type PageStateProps = {
  source: string
}

interface Markdown {
  props: PageStateProps;
}

class Markdown extends Component {

  componentDidMount() {
    // const { source = '' } = this.props
    // const codeHtml = marked(source)
    // WxParse.wxParse('article', 'html', codeHtml, this.$scope, 5)
  }

  render() {
    const { source = '' } = this.props
    const codeHtml = marked(source)
    return (
      <View>
        <RichText nodes={codeHtml} />
        {/* <import src='../wxParse/wxParse.wxml' />
        <template is='wxParse' data='{{wxParseData:article.nodes}}' /> */}
      </View>
    )
  }
}

export default Markdown
