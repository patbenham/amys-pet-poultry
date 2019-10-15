const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';
const pkg = require('./package.json');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = env => {
  if(env.NODE_ENV === LEGACY_CONFIG) {
    return merge(
      common.legacyConfig,
      {
        output: {
          filename: '[name]-legacy.[hash].js',
          chunkFilename: '[name]-legacy.js',
        },
        mode: 'production',
        devtool: 'eval-source-map',
        module: {
          rules: [
            configureCssLoader(LEGACY_CONFIG),
            configureImageLoader(LEGACY_CONFIG),
            configureHtmlLoader(LEGACY_CONFIG),
          ],
        },
        plugins: [
          new FaviconsWebpackPlugin({
            logo: './src/img/favicon.png',
            inject: true,
          }),
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            analyzerPort: 8887,
          }),
          new HtmlCriticalWebpackPlugin({
            base: path.resolve(__dirname, 'dist'),
            src: 'index.html',
            dest: 'index.html',
            inline: true,
            minify: true,
            extract: true,
            width: 375,
            height: 565,
            penthouse: {
              blockJSRequests: false,
            }
          })
        ],
      }
    );
  }
  if(env.NODE_ENV === MODERN_CONFIG) {
    return merge(
      common.modernConfig,
      {
        output: {
          filename: '[name].[hash].js',
          chunkFilename: '[name].js',
        },
        mode: 'production',
        devtool: 'eval-source-map',
        module: {
          rules: [
            configureCssLoader(MODERN_CONFIG),
            configureImageLoader(MODERN_CONFIG),
            configureHtmlLoader(MODERN_CONFIG),
          ],
        },
        plugins: [
          new FaviconsWebpackPlugin('./src/img/favicon.png'),
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            analyzerPort: 8887,
          }),
          new HtmlCriticalWebpackPlugin({
            base: path.resolve(__dirname, 'dist'),
            src: 'index.html',
            dest: 'index.html',
            inline: true,
            minify: true,
            extract: true,
            width: 375,
            height: 565,
            penthouse: {
              blockJSRequests: false,
            }
          })
        ],
      }
    );
  }
};

function configureCssLoader(buildType) {
  return {
    test: /\.(sa|sc|c)ss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: false,
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
            require('cssnano')(),
          ]
        }
      },
      'sass-loader',
    ]
  };
}

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
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        // optipng.enabled: false will disable optipng
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },
        // the webp option will enable WEBP
        webp: {
          quality: 75
        }
      }
    },
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
        options: { minimize: true },
      },
    ]
  };
}
