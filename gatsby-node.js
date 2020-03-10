const path = require('path')

const getIntl = (locale, prefix) => {
  const translations = require(`./locales/${locale.split('-')[0]}.json`)
  return { ...translations.global, ...translations[prefix] }
}

exports.createResolvers = require('./create-resolvers')

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
    const intl = getIntl(site.language, type.handle)
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

  return Promise.all(
    data.craft.sites.map(site => createPages({ graphql, createPage, site }))
  )
}
