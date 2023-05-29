const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/index.tsx',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
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
        new HtmlWebpackPlugin()
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/js'),
        clean: true
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'web'),
        },
        compress: true,
        port: 9000,
    },
};
