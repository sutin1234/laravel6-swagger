require('dotenv').config();

const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
// const ModernizrWebpackPlugin = require('modernizr-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const CriticalCssPlugin = require('critical-css-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

// configuration
const templateName = 'ic-robertsonquay';
const destination = `public/templates/${templateName}/`;
const publicPath = `templates/${templateName}/`;
// const resourceDir = `resources/views/templates/${template_name}/layouts`
const templatePath = path.resolve(
  __dirname,
  `./public/templates/${templateName}`
);
const srcPath = path.join(__dirname, 'src');
const jsVendorsPath = `${srcPath}/vendors`;
const assetsPath = `${srcPath}/assets`;
// const jsVendorsPath = `${srcPath}/vendors`

const sourceJS = './src/es2015';
const entryFile = `${sourceJS}/app.mobile.js`;
const styleOutputFile = 'styles/mobile.main.css';

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'resources/assets/js/components/app.js')
    // polyfill: `${sourceJS}/polyfill.js`
  },
  devtool: false,
  mode: process.env.NODE_ENV,
  output: {
    filename: 'js/mobile/m.[name].js',
    chunkFilename: 'js/mobile/m.vendor.[name].js',
    path: path.join(__dirname, destination),
    publicPath: '/' + publicPath
  },
  performance: {
    hints: false,
    maxEntrypointSize: 22400,
    maxAssetSize: 22400
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: devMode,
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          output: {
            comments: false
          },
          comporess: {
            drop_console: true
          }
        }
      })
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.scss', '.vue', '.jsx'], // support ext
    alias: {
      // Modernizr: `imports-loader?this=>window!exports-loader?${jsVendorsPath}/modernizr-custom.js`,
      // Detectizr: `imports-loader?this=>window!exports-loader?${jsVendorsPath}/detectizr.min.js`,
      '@venderPath': jsVendorsPath,
      '@nodePath': path.join(__dirname, 'node_modules'),
      '@js': path.join(__dirname, 'src/es2015/'),
      vue: 'vue/dist/vue.esm.js',
      vue$: 'vue/dist/vue.common.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'vue-loader',
        options: {
          extractCSS: true
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceMap: devMode
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: devMode
            }
          }
        ]
      },
      {
        test: /\.(scss|sass)$/i,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                importLoaders: 1
              }
            }
          ],
          // use style-loader in development
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'file-loader',
        query: {
          outputPath: 'fonts',
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file-loader',
        query: {
          outputPath: 'fonts',
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: [
          'file-loader?name=images/[name].[ext]'
          //'image-webpack-loader?bypassOnDebug'
        ],
        enforce: 'pre'
      },
      {
        test: /modernizr/,
        loader: 'imports-loader?this=>window!exports-loader?window.Modernizr'
      },
      {
        test: /detectizr/,
        loader: 'imports-loader?this=>window!exports-loader?window.Detectizr'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      jquery: 'jquery',
      moment: 'moment',
      verge: 'verge'
    }),
    new webpack.DefinePlugin({
      $: 'jquery',
      'window.$': 'jquery'
    }),
    new CopyWebpackPlugin([
      // {
      //     from: `${assetsPath}`,
      //     to: path.resolve(__dirname, 'public')
      // },
      // {
      //     from: `${srcPath}/images/`,
      //     to: path.join(__dirname, destination + 'images')
      // },
      // {
      //     from: `${srcPath}/fonts/`,
      //     to: path.join(__dirname, destination + 'fonts')
      // },
      // {
      //     from: `${srcPath}/fonts/`,
      //     to: path.join(__dirname, destination + '/assets/fonts')
      // },
      // {
      //     from: `${srcPath}/images/`,
      //     to: path.resolve(__dirname, destination + '/assets/images')
      // },
      // {
      //     from: `${srcPath}/favicons/`,
      //     to: path.resolve(__dirname, destination + '/assets/favicons')
      // },
      // {
      //     context: `${srcPath}/media/`,
      //     from: '**/*',
      //     to: path.resolve(__dirname, destination + '/assets/media')
      // },
      // {
      //     from: `${srcPath}/uploads/`,
      //     to: path.resolve(__dirname, 'public')
      // }
    ]),
    new MomentLocalesPlugin({
      localesToKeep: ['en']
    }),
    new LodashModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new WebpackBuildNotifierPlugin({
      title: `Webpack mobile build  ${process.env.NODE_ENV} mode successfully!`,
      suppressSuccess: true
    }),
    new ExtractTextPlugin({
      filename: styleOutputFile
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      },
      canPrint: true
    }),
    new MinifyPlugin()
  ]
};
