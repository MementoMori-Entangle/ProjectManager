const path = require('path');
module.exports = {
    // 指定できる値は、ファイル名の文字列や、それを並べた配列やオブジェクト
    // 下記はオブジェクトとして指定した例 
    entry: {
        bundle: './src/components/app.tsx'
    },
    output: {
        // "__dirname"はこのファイルが存在するディレクトリを表す node.js で定義済みの定数
        path: path.join(__dirname,'dist'),
        filename: '[name].js'  // [name]はentryで記述した名前(この例ではbundle）が入る
    },
    // 例えば「 import Foo from './foo' 」と記述すると "foo.ts" という名前のファイルをモジュールとして探す
    resolve: {
        extensions:['.ts', '.tsx', '.js']
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        ],
    },
    module: {
        rules: [
            {
                // TypeScriptコンパイラを適用する
                test:/\.(ts|tsx)$/,loader: 'ts-loader'
            }
        ]
    }
}