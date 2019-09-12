'use strict';
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV || 'development';
const PATHS = {
    assets: path.resolve(__dirname, 'development/assets'),
    entries: path.resolve(__dirname, 'development/assets/js/pages'),
    pages: path.resolve(__dirname, 'development/pug/pages'),
    public: path.resolve(__dirname, 'www/public')
};
const PAGES = fs.readdirSync(PATHS.pages).filter(fileName => fileName.endsWith('.pug'));

module.exports = {
    context: path.resolve(__dirname, 'development'),
    mode: NODE_ENV,
    entry: {
        about: `${PATHS.entries}/about/about.js`,
        blog_1: `${PATHS.entries}/blog_1/blog_1.js`,
        contact: `${PATHS.entries}/contact/contact.js`,
        home: `${PATHS.entries}/home/home.js`,
        portfolio_1: `${PATHS.entries}/portfolio_1/portfolio_1.js`,
        services: `${PATHS.entries}/services/services.js`,
        single_post: `${PATHS.entries}/single_post/single_post.js`,
        single_project: `${PATHS.entries}/single_project/single_project.js`,
        single_project_2: `${PATHS.entries}/single_project_2/single_project_2.js`
    },
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'public/js/[name].[chunkhash].js'
    },
    watch: NODE_ENV === 'development',
    devtool: NODE_ENV == 'development' ? 'cheap-module-eval-source-map' : false,
    devServer: {
        overlay: true,
        contentBase: path.resolve(__dirname, 'www')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    enforce: true
                },
                plugins: {
                    name: 'plugins',
                    test: /[\\/]plugins[\\/]/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /[\\/]node_modules[\\/]/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: NODE_ENV == 'development' ? true : false
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: NODE_ENV == 'development' ? true : false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: NODE_ENV == 'development' ? true : false,
                            config: {
                                path: 'development/assets/js/postcss.config.js'
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: NODE_ENV == 'development' ? true : false
                        }
                    }

                ]
            },
            {
                test: /\.pug$/i,
                use: {
                    loader: 'pug-loader',
                    options: {
                        pretty: true
                    }
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'public/fonts/[name].[ext]'
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'public/img/[name].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./public/css/*', './public/js/*', './public/font/*'],
        }),
        new webpack.DefinePlugin({
            NODE_ENV: NODE_ENV
        }),
        new UglifyJsPlugin({
            test: /\.js(\?.*)?$/i,
            uglifyOptions: {
                exclude: /[\\/]node_modules[\\/]/,
                compress: {
                    unsafe: true,
                    inline: true,
                    keep_fargs: false,
                },
                output: {
                    beautify: false,
                },
                mangle: true,
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'public/css/styles.[contenthash].css'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jquery': 'jquery',
            WOW: 'wow.js'
        }),
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PATHS.pages}/${page}`,
            filename: (`${page}` == 'home.pug') ? `./${page.replace(/home.pug/, 'index.html')}` : `./${page.replace(/\.pug/, '.html')}`,
            chunks: ['vendors', 'plugins', `${page.replace(/\.pug/, '')}`],
            chunksSortMode: 'manual'
        })),
        new webpack.SourceMapDevToolPlugin({
            filename: NODE_ENV == 'development' ? 'public/js/[name].js.map' : false,
            exclude: ['vendors.js'],
            append: NODE_ENV == 'development' ? '/*# sourceMappingURL=[url]*/' : ' '
        }),
        new CopyWebpackPlugin([
            {from: `${PATHS.assets}/img`, to: `${PATHS.public}/img`},
            {from: `${PATHS.assets}/fonts`, to: `${PATHS.public}/fonts`}
        ]),
        new WebpackMd5Hash(),
        new ProgressBarPlugin()
    ]

};
