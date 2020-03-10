import React from 'react'
import { graphql } from 'gatsby'
import { useIntl } from 'react-intl'

const ProductPage = ({
  data: {
    craft: { entry },
  },
}) => {
  const { title, cover, shopifyProduct } = entry
  const { formatMessage: t } = useIntl()

  return (
    <>
      <h1>{title}</h1>
      <h2>{t({ id: 'product localisation' })}</h2>
      <div>
        <img src={cover[0].url} alt="img" />
      </div>
      {shopifyProduct && (
        <a
          href={`https://craftql.myshopify.com/${shopifyProduct.handle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy from {shopifyProduct.priceRange.minVariantPrice.amount}{' '}
          {shopifyProduct.priceRange.minVariantPrice.currencyCode}
        </a>
      )}
    </>
  )
}

export default ProductPage

export const query = graphql`
  query($id: Int!, $site: String!) {
    craft {
      entry(site: $site, id: [$id]) {
        seomatic(asArray: true) {
          metaLinkContainer
        }
        title
        id
        ... on CRAFT_ProductsProduct {
          shopifyProductId
          shopifyProduct {
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
          cover {
            url
          }
        }
      }
    }
  }
`
