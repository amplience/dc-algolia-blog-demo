import dotenv from 'dotenv';
import pkg from './package.json';

dotenv.config();

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/reset.css',
    'element-ui/lib/theme-chalk/base.css',
    'element-ui/lib/theme-chalk/card.css',
    'element-ui/lib/theme-chalk/row.css',
    'element-ui/lib/theme-chalk/col.css',
    'element-ui/lib/theme-chalk/main.css',
    'element-ui/lib/theme-chalk/pagination.css',
    'element-ui/lib/theme-chalk/container.css',
    'element-ui/lib/theme-chalk/header.css',
    'instantsearch.css/themes/algolia.css',
    '@/assets/styles/default.scss'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/element-ui', '@/plugins/filters', '@/plugins/algolia-instantsearch'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    transpile: ['vue-instantsearch', 'instantsearch.js/es'],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx): void {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(ts|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  },

  srcDir: './src/',

  env: {
    ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
    ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME,
    DC_BLOG_POST_RENDERING_TEMPLATE: process.env.DC_BLOG_POST_RENDERING_TEMPLATE,
    DC_RENDERING_SERVICE_ACCOUNT_ID: process.env.DC_RENDERING_SERVICE_ACCOUNT_ID,
    DC_RENDERING_SERVICE_STAGING_DOMAIN: process.env.DC_RENDERING_SERVICE_STAGING_DOMAIN,
    DC_RENDERING_SERVICE_BASE_URL: process.env.DC_RENDERING_SERVICE_BASE_URL,
    NUMBER_OF_SEARCH_RESULTS: process.env.NUMBER_OF_SEARCH_RESULTS
  }
};
