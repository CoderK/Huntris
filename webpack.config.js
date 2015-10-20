module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname + "/build",
        filename: "huntris.js"
    },
    module: {
        loaders: [
            {
                test: /.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};