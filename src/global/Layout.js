import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'

import './layout.css'

const Layout = ({ children, props }) => {
  const { craft } = useStaticQuery(graphql`
    {
      craft {
        sites {
          handle
          language
        }
      }
    }
  `)

  const { data } = props

  const { formatMessage: t } = useIntl()

  const hrefLinks = data
    ? data.craft.entry.seomatic.metaLinkContainer.alternate
    : []

  return (
    <>
      <Helmet>
        {hrefLinks.map(({ hreflang, href }) => (
          <link
            rel="alternate"
            href={href}
            hrefLang={hreflang}
            key={hreflang}
          />
        ))}
      </Helmet>
      <main>{children}</main>
      <footer>
        <h3>{t({ id: 'welcome' })}</h3>
        {hrefLinks.length > 0 && (
          <>
            Locales
            {craft.sites.map(({ handle, language }) => (
              <div key={handle}>
                <Link
                  to={
                    hrefLinks.find(h => h.hreflang === language.toLowerCase())
                      .path
                  }
                >
                  {handle}
                </Link>
              </div>
            ))}
          </>
        )}
      </footer>
    </>
  )
}

export default Layout
