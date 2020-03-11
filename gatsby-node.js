const path = require('path')

const getIntl = (locale, prefix) => {
  const translations = require(`./locales/${locale.split('-')[0]}.json`)
  return { ...translations.global, ...translations[prefix] }
}

exports.createResolvers = require('./create-resolvers')

// La fonction ci-dessous crée simplement les pages pour la home et les différents produits.
// Pour simplifier j'ai fait en sorte que le handle de l'entrée corresponde au fichier de template
// utilisé pour l'entrée (product => /templates/product.js)
const createPages = async ({ graphql, createPage, site }) => {
  const { data } = await graphql(
    `
      query($site: String!) {
        craft {
          entries(section: [home, products], site: $site) {
            id
            url
            type {
              handle
            }
          }
        }
      }
    `,
    { site: site.handle }
  )

  data.craft.entries.forEach(({ id, url, type }) => {
    // On récupère l'ensemble des clés statiques nécessaires pour la loc.
    const intl = getIntl(site.language, type.handle)
    // On récuppère le template à utiliser.
    const template = path.resolve(`src/templates/${type.handle}.js`)
    createPage({
      component: template,
      path: url,
      context: { id, site: site.handle, intl, locale: site.language },
    })
  })
}

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const { data } = await graphql(`
    query {
      craft {
        sites {
          handle
          language
        }
      }
    }
  `)

  // On boucle sur tous les sites (donc toutes les versions localisées) pour créer toutes les pages.
  return Promise.all(
    data.craft.sites.map(site => createPages({ graphql, createPage, site }))
  )
}
