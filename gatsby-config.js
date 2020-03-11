require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Craft CMS + Gatsby + Shopify`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'CRAFT',
        fieldName: 'craft',
        url: `${process.env.GATSBY_CRAFT_URL}/craftql`,
        headers: {
          Authorization: `Bearer ${process.env.CRAFTQL_TOKEN}`,
        },
      },
    },
    {
      resolve: 'gatsby-source-shopify',
      options: {
        shopName: 'craftql',
        accessToken: process.env.SHOPIFY_TOKEN,
        verbose: false,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
      },
    },
  ],
}
