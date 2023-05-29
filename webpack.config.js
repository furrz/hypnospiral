const path = require('path');

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
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'web/js'),
    },
};
