const path = require('path')
const fs = require('fs')
const WebpackFreeTexPacker = require('webpack-free-tex-packer')

const atlases = path.join(__dirname, 'atlases')

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('url-loader')
      .test(/(?:\/assets\/.+\.json|\.(?:png|jpe?g|gif|webp)(?:\?.*)?)$/i)

    fs.readdirSync(atlases).forEach(name => {
      const atlas = path.join(atlases, name)
      if (!fs.lstatSync(atlas).isDirectory()) return

      config
        .plugin('free-tex-packer-' + name)
        .use(WebpackFreeTexPacker, [atlas, 'atlases', {
          exporter: 'PhaserArray',
          textureName: path.basename(atlas),
          removeFileExtension: true
        }])
    })
  },

  css: {
    loaderOptions: {
      sass: {
        data: '@import ~@/stylesheets/index.sass'
      }
    }
  }
}
