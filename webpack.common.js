// node modules
const path = require('path');
const merge = require('webpack-merge');

// webpack plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

// config files
const pkg = require('./package.json');

const buildRoot = path.resolve(__dirname, "dist");

// The base webpack config
const baseConfig = {
  name: pkg.name,
  entry: {
    main: './src/index.js',
    gallery: './src/gallery/gallery.js'
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defer: /gallery.*\.js/
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
      //ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new CleanWebpackPlugin(),
    // new FaviconsWebpackPlugin('./src/img/favicon.png'),
  ],
  module: {
    rules: [
    ],
  },
};

const legacyConfig = {
  output: {
    path: path.join(buildRoot, 'legacy'),
  },
  module: {
    rules: [
      configureBabelLoader(Object.values(pkg.browserslist.legacyBrowsers)),
    ],
  },
  plugins: [
  ]
};

// Modern webpack config
const modernConfig = {
  output: {
    path: path.join(buildRoot, 'modern'),
  },
  module: {
    rules: [
      configureBabelLoader(Object.values(pkg.browserslist.modernBrowsers)),
    ],
  },
  plugins: [
  ]
};

function configureBabelLoader(browserList) {
  return {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: [
          [
            "@babel/preset-env", {
              // debug: true,
              // Configure how @babel/preset-env handles polyfills from core-js.
              // https://babeljs.io/docs/en/babel-preset-env
              useBuiltIns: 'usage',
              targets: { browsers: browserList },
              corejs: 3,
            }],
        ],
        plugins: [],

      }
    }
  };
};

module.exports = {
  'legacyConfig': merge.strategy({
    module: 'prepend',
    plugins: 'prepend',
  })(
    baseConfig,
    legacyConfig,
  ),
  'modernConfig': merge.strategy({
    module: 'prepend',
    plugins: 'prepend',
  })(
    baseConfig,
    modernConfig,
  ),
};
