const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const config = ({ isDev }) => ({
    mode: isDev ? 'development' : 'production',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    entry: {
        main: './src/index.js'
    },
    devtool: `${isDev ? 'inline-source-map' : 'source-map'}`,
    devServer: {
        port: 3000,
        historyApiFallback: true,
        open: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/](?!.core-js|babel-runtime).*[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.js$/,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            inject: 'body',
            cache: false,
            minify:
                isDev
                    ? false
                    : {
                        collapseWhitespace: true,
                        removeComments: true
                    }
        }),
        ...(isDev ?
            [new MiniCssExtractPlugin({
                linkType: false,
                filename: '[name].[contenthash].css',
            })] : [])
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.[name].[chunkhash].js',
        chunkFilename: 'chunk.[name].[chunkhash].js',
        publicPath: '/',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|jpe?g|svg|gif|webp|ico)$/i,
                loader: 'url-loader',
                options: {
                    name: 'images/[[name].[ext]?[hash]',
                    fallback: 'file-loader',
                    limit: 10000
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                loader: 'url-loader',
                options: {
                    name: 'fonts/[[name].[ext]?[hash]',
                    fallback: 'file-loader',
                    limit: 10000
                }
            },
        ]
    }
})

module.exports = (env, argv) => config({ isDev: argv.mode === 'development' })
