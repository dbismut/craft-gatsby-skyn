import React from 'react'
import { graphql, Link } from 'gatsby'

const HomePage = ({
  data: {
    craft: { entry, products },
  },
}) => {
  return (
    <>
      <h1>Home</h1>
      <ul>
        {products.map(({ id, url, title }) => (
          <li key={id}>
            <Link to={url}>{title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default HomePage

export const query = graphql`
  query($id: Int!, $site: String!) {
    craft {
      entry(site: $site, id: [$id]) {
        seomatic(asArray: true) {
          metaLinkContainer
        }
        title
        id
      }
      products: entries(section: products, site: $site) {
        id
        title
        url
      }
    }
  }
`
