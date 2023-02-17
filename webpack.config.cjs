const path = require('path');
const webpack = require('webpack');
const FilemanagerPlugin = require('filemanager-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WextManifestWebpackPlugin = require('wext-manifest-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const Dotenv = require('dotenv-webpack');

const viewsPath = path.join(__dirname, 'views');
const sourcePath = path.join(__dirname, 'source');
const destPath = path.join(__dirname, 'extension');
const nodeEnv = process.env.NODE_ENV || 'development';
const targetBrowser = process.env.TARGET_BROWSER;

const extensionReloaderPlugin =
  nodeEnv === 'development'
    ? new ExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        // TODO: reload manifest on update
        contentScript: 'contentScript',
        background: 'background',
        extensionPage: ['popup', 'dapp'],
      },
    })
    : () => {
      this.apply = () => { };
    };

const getExtensionFileType = (browser) => {
  if (browser === 'opera') {
    return 'crx';
  }

  if (browser === 'firefox') {
    return 'xpi';
  }

  return 'zip';
};

module.exports = {
  devtool: false, // https://github.com/webpack/webpack/issues/1194#issuecomment-560382342

  stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },

  mode: nodeEnv,

  watchOptions: {
    ignored: '**/node_modules',
  },

  entry: {
    manifest: path.join(__dirname, 'manifest.json'),
    background: path.join(sourcePath, 'scripts/Background', 'index.ts'),
    contentScript: path.join(sourcePath, 'scripts/ContentScript', 'index.ts'),
    popup: path.join(sourcePath, 'containers/Popup', 'index.tsx'),
    dapp: path.join(sourcePath, 'containers/Dapp', 'index.tsx'),
  },

  output: {
    path: path.join(destPath, targetBrowser),
    filename: 'js/[name].bundle.js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert/'),
      os: require.resolve('os-browserify/browser'),
      fs: require.resolve('browserify-fs'),
    },
    alias: {
      'webextension-polyfill-ts': path.resolve(
        path.join(__dirname, 'node_modules', 'webextension-polyfill-ts')
      ),
      '~assets': path.resolve(__dirname, 'source/assets'),
      '~components': path.resolve(__dirname, 'source/components'),
      '~scripts': path.resolve(__dirname, 'source/scripts'),
      '~pages': path.resolve(__dirname, 'source/pages'),
      '~i18n': path.resolve(__dirname, 'source/i18n'),
      '~state': path.resolve(__dirname, 'source/state'),
      '~utils': path.resolve(__dirname, 'source/utils'),
      '~hooks': path.resolve(__dirname, 'source/hooks'),
      '~global': path.resolve(__dirname, 'source/global'),
    },
  },

  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(jpg|png|gif|woff|eot|ttf|svg)/,
        use: {
          loader: 'url-loader', // this need file-loader
          options: {
            limit: 50000,
          },
        },
      },
      {
        type: 'javascript/auto', // prevent webpack handling json with its own loaders,
        test: /manifest\.json$/,
        use: {
          loader: 'wext-manifest-loader',
          options: {
            usePackageJSONVersion: true, // set to false to not use package.json version for manifest
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // It creates a CSS file per JS file which contains CSS
          },
          {
            loader: 'css-loader', // Takes the CSS files and returns the CSS with imports and url(...) for Webpack
            options: {
              import: true,
              url: false,
              sourceMap: true,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          'resolve-url-loader', // Rewrites relative paths in url() statements
          'sass-loader', // Takes the Sass/SCSS file and compiles to the CSS
          {
            loader: 'sass-resources-loader',
            options: {
              // Provide path to the file with resources
              resources: './source/assets/styles/index.scss',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      assert: 'assert',
      process: 'process/browser.js',
      nodeinspectextracted: 'node-inspect-extracted',
    }),
    // Plugin to not generate js bundle for manifest entry
    new WextManifestWebpackPlugin(),
    // Generate sourcemaps
    new webpack.SourceMapDevToolPlugin({ filename: false }),
    new ForkTsCheckerWebpackPlugin(),
    // environmental variables
    new webpack.EnvironmentPlugin(['NODE_ENV', 'TARGET_BROWSER']),
    // delete previous build files
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(process.cwd(), `extension/${targetBrowser}`),
        path.join(
          process.cwd(),
          `extension/${targetBrowser}.${getExtensionFileType(targetBrowser)}`
        ),
      ],
      cleanStaleWebpackAssets: false,
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'popup.html'),
      inject: 'body',
      chunks: ['popup'],
      hash: true,
      filename: 'popup.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'dapp.html'),
      inject: 'body',
      chunks: ['dapp'],
      hash: true,
      filename: 'dapp.html',
    }),
    // write css file(s) to build folder
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
    // copy static assets
    new CopyWebpackPlugin({
      patterns: [{ from: 'source/assets', to: 'assets' }],
    }),
    // plugin to enable browser reloading in development mode
    extensionReloaderPlugin,
    new Dotenv(),
    new NodePolyfillPlugin()
  ],

  optimization: {
    minimize: nodeEnv === 'development' ? false : true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
      new FilemanagerPlugin({
        events: {
          onEnd: {
            archive: [
              {
                format: 'zip',
                source: path.join(destPath, targetBrowser),
                destination: `${path.join(
                  destPath,
                  targetBrowser
                )}.${getExtensionFileType(targetBrowser)}`,
                options: { zlib: { level: 6 } },
              },
            ],
          },
        },
      }),
    ],
  },
};
