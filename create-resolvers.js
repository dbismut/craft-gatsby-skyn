const { GraphQLJSON } = require('gatsby/graphql')

const resolveUrl = ({ url }) => new URL(url).pathname

// C'est la partie la plus "compliquée". Les résolveurs permettent
// de transformer les champs appelés en GraphQL.

// Le résolveur le plus utilisé (resolveUrl) transforme simplement le champ renvoyé par Craft
// qui intègre l'URL serveur (genre https://www.craft-url.com/en-gb/condoms/large) en pathname (/en-gb/condoms/large).
// Craft peut renvoyer la variable uri mais elle n'intègre pas la langue.

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
      // Ce résolveur vient récupérer le shopifyProductId de Craft et lui associe
      // le produit Shopify depuis l'api Graphql de Shopify.
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
      // Celui là est un peu plus tiré par les cheveux mais ce plugin Craft permet d'automatiquement
      // généré les liens canoniques, SEO, etc. Pour cette démo je me sers des liens hreflang pour
      // gérer le passage d'une langue à l'autre. Comme les liens hreflang intègrent le host, je crée une
      // variable path qui ne contient que le pathname.
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
