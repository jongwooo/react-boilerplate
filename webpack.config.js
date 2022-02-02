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
        }),
        isDev &&
        new MiniCssExtractPlugin({
            linkType: false,
            filename: '[name].[contenthash].css',
        })
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
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            targets: {
                                esmodules: true
                            }
                        }],
                        '@babel/preset-react'
                    ],
                }
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                exclude: /node_modules/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp|ico)$/i,
                include: path.resolve(__dirname, 'src'),
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
            {
                test: /\.svg$/i,
                type: 'asset/inline',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                include: path.resolve(__dirname, 'src'),
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },
            {
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader'],
            },
            {
                test: /\.xml$/i,
                use: ['xml-loader'],
            },
        ]
    }
})

module.exports = (env, argv) => config({ isDev: argv.mode === 'development' })
