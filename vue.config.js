module.exports = {
    publicPath: './',
    chainWebpack: config => {
        config.set('externals', {
          'vue': 'Vue',
          'vue-router': 'VueRouter',
          'axios': 'axios',
          'element-ui': 'ELEMENT'
        })
      }
  }
  