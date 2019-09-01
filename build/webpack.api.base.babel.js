import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

export default {
    target: 'node',
    externals: [
        nodeExternals({
            includeAbsolutePaths: true,
        })
    ],
    node: {
        __dirname: false,
        __filename: false,
    },
    context: path.resolve(__dirname, '../src'),
    entry: {
        index: [
            './index.js',
            '../package.json'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: (/node_modules/),
            },
            {
                test: /package\.json$/,
                loader: 'file-loader',
                options: {
                    name: '[name].json'
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: /package\.json/
            }
        ],
    }
}
