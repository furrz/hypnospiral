const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const ReactDOM = require('react-dom/server');
const React = require('react');
const isDevelopment = process.env.NODE_ENV !== 'production';

const commonConfig = (isNodeSide) => ({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        getCustomTransformers: () => ({
                            before: [(!isNodeSide) && isDevelopment && ReactRefreshTypeScript()].filter(Boolean)
                        }),
                        transpileOnly: isDevelopment,
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                use: [{loader: '@svgr/webpack', options: {typescript: true}}],
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
})

const serverConfig = {
    ...commonConfig(true), ...{
        entry: './src/components/app.tsx',
        target: 'node',
        devtool: 'eval',
        output: {
            filename: 'bundle.server.js',
            path: path.resolve(__dirname, 'tmp'),
            clean: true,
            library: {
                name: 'App',
                type: 'commonjs-static',
            }
        },
        externals: {
            "react": "commonjs react",
            "react-dom": "commonjs react-dom"
        },
        ...commonConfig
    }
};

const clientConfig = {
    ...commonConfig(false), ...{
        entry: './src/index.tsx',
        devtool: isDevelopment && 'source-map',
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {from: 'web'}
                ]
            }),
            new HtmlWebpackPlugin({
                // The "template" line has been removed.
                templateParameters: async () => {
                    if (isDevelopment) {
                        return { injectCode: '' };
                    }
                    const { App } = (require('./tmp/bundle.server.js'));
                    React.useLayoutEffect = React.useEffect
                    return { injectCode: ReactDOM.renderToStaticMarkup(React.createElement(App.default, null, null)) }
                }
            }),
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
    }
};

module.exports = [serverConfig, clientConfig];
