const path = require('path')
const fs = require('fs')
const WebpackFreeTexPacker = require('webpack-free-tex-packer')

const atlases = path.join(__dirname, 'atlases')

module.exports = {
  lintOnSave: false,

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
          allowRotation: false,
          textureName: path.basename(atlas),
          removeFileExtension: true
        }])
    })

    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('exit-process')
        .use({
          apply (compiler) {
            compiler.hooks.done.tap('exit-process', () => {
              setTimeout(() => process.exit(), 500)
            })
          }
        })
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import ~@/stylesheets/index.sass'
      }
    }
  }
}
