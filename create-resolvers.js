const { GraphQLJSON } = require('gatsby/graphql')

const resolveUrl = ({ url }) => new URL(url).pathname

module.exports = function createResolvers({ createResolvers }) {
  const resolvers = {
    CRAFT_Home: {
      url: { resolve: resolveUrl },
    },
    CRAFT_RangesRange: {
      url: { resolve: resolveUrl },
    },
    CRAFT_ProductsProduct: {
      url: { resolve: resolveUrl },
      shopifyProduct: {
        type: 'ShopifyProduct',
        resolve(source, args, context, info) {
          const id = Buffer.from(
            `gid://shopify/Product/${source.shopifyProductId}`
          ).toString('base64')
          return context.nodeModel.runQuery({
            query: {
              filter: { shopifyId: { eq: id } },
            },
            type: 'ShopifyProduct',
            firstOnly: true,
          })
        },
      },
    },
    CRAFT_seomaticData: {
      metaLinkContainer: {
        type: GraphQLJSON,
        resolve(source, args, context, info) {
          const json = JSON.parse(source.metaLinkContainer)
          Object.keys(json).forEach(key => {
            const k = json[key]
            json[key] = Array.isArray(k)
              ? k.map(h => ({ ...h, path: new URL(h.href).pathname }))
              : { ...k, path: new URL(k.href).pathname }
          })
          return json
        },
      },
    },
  }

  createResolvers(resolvers)
}
