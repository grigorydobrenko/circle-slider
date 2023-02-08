const webpack = require('webpack')

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        open: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.name': JSON.stringify('Vishwas'),
        }),
    ],
}
