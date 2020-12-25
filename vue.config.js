module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://192.168.10.180:40001',
        pathRewrite: {
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
