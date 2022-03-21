const path = require('path');
const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const IS_DEBUG = process.env.NODE_ENV === 'development';
const IS_RELEASE = process.env.NODE_ENV !== 'development';

const options = {
  POSTCSS: {
    sourceMap: IS_DEBUG,
    postcssOptions: {
      plugins: {
        'postcss-preset-env': {},
        'autoprefixer': {},
        'tailwindcss': {},
        'cssnano': {
          preset: ['default', { discardComments: { removeAll: true } }]
        },
      },
    },
  },

  CSS: {
    sourceMap: IS_DEBUG,
  }
}

module.exports = {
  mode: 'development',

  entry: {
    scripts: path.resolve(__dirname, 'scripts', 'main.ts'),
    styles: path.resolve(__dirname, 'styles', 'style.css'),
  },

  output: {
    path: path.resolve(__dirname, 'out'),
    filename: path.join('[name].[contenthash].js'),
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.glsl'],
  },

  devServer: {
    port: 8080,
    compress: true,
    static: {
      directory: path.join(__dirname, 'out'),
    },
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: true,
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html')
    }),

    new MiniCssExtractPlugin({
      filename: path.join('[name].[contenthash].css'),
    }),

    new IgnoreEmitPlugin([
      /^(styles)\.([a-f0-9]+)\.(js)/gs,
    ]),

    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'static'),
      }]
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader', options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }]
              ]
            }
          },
          { loader: 'ts-loader' },
        ]
      },

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: options.CSS, },
          { loader: 'postcss-loader', options: options.POSTCSS, },
        ],
      },

      {
        test: /\.glsl$/,
        use: 'raw-loader',
      },

      {
        test: /\.(woff|woff2|ttf|svg|png|jpeg|webp)?$/,
        use: 'url-loader',
      },
    ],
  },

  optimization: {
    minimize: IS_RELEASE,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: { output: { comments: false } }
      })
    ],
  },
};
