// const LEGACY_CONFIG = 'legacy';
// const MODERN_CONFIG = 'modern';
// const pkg = require('./package.json');
// const path = require('path');
// const devMode = process.env.NODE_ENV !== 'production';
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Plugins
const DashboardPlugin = require('webpack-dashboard/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
  const mergeTarget = env.NODE_ENV;
  const mergeTargetConfig =
    mergeTarget === 'legacy' ? common.legacyConfig : common.modernConfig;

  return merge(mergeTargetConfig, {
    output: {
      filename: '[name].js',
      chunkFilename: '[name].CHUNK.js'
    },
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      contentBase: './dist',
      host: '0.0.0.0',
      port: '8080'
    },
    module: {
      rules: [
        configureCssLoader(mergeTarget),
        configureImageLoader(mergeTarget),
        configureHtmlLoader(mergeTarget)
      ]
    },
    plugins: [new DashboardPlugin()]
  });
};

function configureImageLoader(buildType) {
  return {
    test: /\.(svg|png|webp|jpe?g|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }
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
          hmr: true
        }
      },
      {
        loader: 'css-loader',
        options: {
          import: false,
          importLoaders: 1,
          sourceMap: true
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          sourceMap: true,
          plugins: [
            require('precss')
            // require('postcss-preset-env')(),
          ]
        }
      }
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
        options: { minimize: false }
      }
    ]
  };
}
