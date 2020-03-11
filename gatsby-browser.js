const React = require('react')
const Layout = require('./src/global/Layout').default
const { IntlProvider } = require('react-intl')

// Wrapper pour l'internationalisation des fichiers statiques locales/xx.json

exports.wrapPageElement = ({ element, props }) => {
  return (
    <IntlProvider
      locale={props.pageContext.locale}
      messages={props.pageContext.intl}
    >
      <Layout props={props}>{element}</Layout>
    </IntlProvider>
  )
}
