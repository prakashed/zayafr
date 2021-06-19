const WebPackConfigUtils = require('webpack-config-utils');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const LessListPlugin = require('less-plugin-lists');
const Dotenv = require('dotenv-webpack');

const { getIfUtils } = WebPackConfigUtils;




// constants
const constants = {
  paths: {
    dist: path.resolve(__dirname, 'dist'),
    src: path.resolve(__dirname, 'src'),
    appSrc: path.resolve(__dirname, 'src/app'),
    themeSrc: path.resolve(__dirname, 'src/theme')
    // loaderSrc: path.resolve(__dirname, 'src/loader'),
  }
};
const themeVariables = lessToJs(
  fs.readFileSync(
    path.join(constants.paths.themeSrc, './_variables.less'),
    'utf8'
  )
);
// configuration
module.exports = env => {
  const { ifProd, ifNotProd } = getIfUtils(env);
  if (ifProd()) {
    console.log('Welcome to production');
  }
  if (ifNotProd()) {
    console.log('Welcome to non production');
  }
  return {
    mode: 'development',
    // devtool: 'source-map',
    entry: {
      // loaderApp: path.join(constants.paths.loaderSrc, 'index.js'),
      mainApp: [
        '@babel/polyfill',
        path.join(constants.paths.appSrc, 'index.jsx')
      ]
    },
    output: {
      path: constants.paths.dist,
      filename: '[name].[hash].js',
      publicPath: '/'
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 300000, // min chunk(file) size of 50KB
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            }
          }
        }
      }
    },
    plugins: [
      new ProgressBarPlugin(),
      new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
      new HtmlWebpackPlugin({
        template: path.join(constants.paths.src, 'index.html'),
        favicon: './src/assets/icons/favicon.ico',
        // chunksSortMode: (a, b) => {
        //   const order = ['loader-vendor', 'loaderApp', 'app-vendor-major', 'app-vendor-minor', 'mainApp'];
        //   const order1 = order.indexOf(a.names[0]);
        //   const order2 = order.indexOf(b.names[0]);
        //   if (order1 > order2) {
        //     return 1;
        //   } else if (order1 < order2) {
        //     return -1;
        //   }
        //   return 0;
        // },
        xhtml: true
      }),
      new Dotenv()
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            'babel-loader'
            // 'eslint-loader',
          ]
        },
        // {
        //   test: /\.less$/,
        //   use: ExtractTextPlugin.extract({
        //     fallback: 'style-loader',
        //     use: [
        //       { loader: 'css-loader' },
        //       { loader: 'postcss-loader' },
        //       {
        //         loader: 'less-loader',
        //         options: {
        //           modifyVars: themeVariables,
        //           plugins: [
        //             new LessListPlugin(),
        //           ],
        //         },
        //       },
        //     ],
        //   }),
        // },
        {
          test: /\.less/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
                modifyVars: themeVariables,
                plugins: [new LessListPlugin()]
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[hash].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]'
              }
            }
          ]
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
      stats: {
        children: false,
        chunks: false
      }
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devtool: 'source-map'
  };
};
