const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';
const pkg = require('./package.json');
const path = require('path');
// const devMode = process.env.NODE_ENV !== 'production';
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Plugins
const DashboardPlugin = require("webpack-dashboard/plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  merge(
    common.legacyConfig,
    {
      output: {
        filename: '[name]-legacy.[hash].js',
        chunkFilename: '[name]-legacy-CHUNK.js',
      },
      mode: 'development',
      devtool: 'eval-source-map',
      devServer: {
        contentBase: './dist',
      },
      module: {
        rules: [
          configureCssLoader(LEGACY_CONFIG),
          configureImageLoader(LEGACY_CONFIG),
          configureHtmlLoader(LEGACY_CONFIG),
        ],
      },
      plugins: [
        new DashboardPlugin(),
      ],
    }
  ),
  // merge(
  //   common.modernConfig,
  //   {
  //     output: {
  //       filename: '[name].[hash].js',
  //       chunkFilename: '[name]-CHUNK.js',
  //     },
  //     mode: 'development',
  //     devtool: 'eval-source-map',
  //     devServer: {
  //       contentBase: './dist',
  //     },
  //     module: {
  //       rules: [
  //         configureCssLoader(MODERN_CONFIG),
  //         configureImageLoader(MODERN_CONFIG),
  //         configureHtmlLoader(MODERN_CONFIG),
  //       ],
  //     },
  //     plugins: [
  //       new DashboardPlugin(),
  //     ],
  //   }
  // ),
];

function configureImageLoader(buildType) {
  return {
    test: /\.(svg|png|webp|jpe?g|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]'
        }
      },
    ]
  };
}

function configureCssLoader(buildType) {
  return {
    test: /\.(sa|sc|c)ss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: true,
        }
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          sourceMap: true
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          sourceMap: true,
          plugins: [
            require('postcss-preset-env')(),
          ]
        }
      },
      'sass-loader',
    ]
  };
}

function configureHtmlLoader(buildType) {
  return {
    test: /\.html$/,
    use: [
      // 'file-loader?name=[name].[ext]', 
      // 'extract-loader', 
      {
        loader: 'html-loader',
        options: { minimize: false },
      },
    ]
  };
}
