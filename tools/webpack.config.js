const path = require('path');
const packageJson = require('../package.json');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: ['./src/app.js']
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'build.js',
        libraryTarget: 'umd',
        library: 'Huntris'
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        hot: true,
        inline: true
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /(node_modules)/,
                query: packageJson.babel
            },
            {
                loader: 'eslint-loader',
                test: /\.js$/,
                exclude: /node_modules/,
                query: {
                    configFile: 'tools/.eslintrc.js'
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                ],
            },
        ]
    }
};
