const config = require('./config.js')

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 4000,
    proxy: {
      '/api': {
        target: config.BASE_URL,
        pathRewrite:{
          '^/api': ''
        },
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/style/variable.scss";@import "@/style/mixins.scss";`
      }
    }
  }
}
