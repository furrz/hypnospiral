const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './src/index.tsx',
    devtool: isDevelopment && 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        getCustomTransformers: () => ({
                            before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean)
                        }),
                        transpileOnly: isDevelopment
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                use: [{loader:'@svgr/webpack', options: {typescript: true}}],
            },
            {
                test: /\.frag$/i,
                type: 'asset/source',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [
            path.resolve(__dirname, 'src'), 'node_modules'
        ],
        roots: [
            path.resolve('./web/')
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'web' }
            ]
        }),
        new HtmlWebpackPlugin(),
        isDevelopment && new ReactRefreshWebpackPlugin()
    ].filter(Boolean),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'web'),
        },
        compress: true,
        port: 9000,
        hot: true,
    },
};
