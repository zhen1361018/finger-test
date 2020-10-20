const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
    // 选项...
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    pages: {
        index: {
            // 入口文件
            entry: 'src/main.ts',
            /*这个是根入口文件*/
            // 模板文件
            template: 'public/index.html',
            // 输出文件
            filename: 'index.html',
            // 页面title
            title: '桌面端',
        },
    },
    configureWebpack: {



        plugins: [
            new CompressionPlugin({
                test: /\.js$|\.html$|.\css/, //匹配文件名
                threshold: 10240, //对超过10k的数据压缩
                deleteOriginalAssets: false //不删除源文件
            })
        ]
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                'productName': 'greefinger',
                'appId': 'com.gree.oim',
                'copyright': 'test', //版权  信息
                "publish": [{
                    "provider": "generic",
                    "url": "http://172.28.102.87:8080"
                }],

                'win': {
                    'icon': 'public/icon_desk.png',
                    'target': [{
                        'target': 'nsis',
                        'arch': [
                            'x64',
                        ],
                    }, ],
                },

                // 'asar': false,
                'directories': {
                    'output': 'dist_electron',
                    'buildResources': 'build',
                    'app': 'dist_electron/bundled',
                },
                'files': ['**/*', "./node_modules/electron-log/**/*", './package.json', ],
                'extraResources': [{ // 拷贝dll等静态文件到指定位置
                    'from': './src/assets',
                    'to': './app/assets',
                }, ],
                'nsis': {
                    'oneClick': false,
                    "allowElevation": true,
                    'allowToChangeInstallationDirectory': true,
                    'createDesktopShortcut': true,
                    'createStartMenuShortcut': true,
                    "include": "build/installer.nsh", // 包含的自定义nsis脚本
                },
            },
        },
    },
};