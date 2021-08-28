import { Card, TextField, DataTable, Spinner, Icon } from "@shopify/polaris"
import { DeleteMajor } from '@shopify/polaris-icons';
import { useQuery, gql } from '@apollo/client'
import { useState, useEffect, useCallback, useRef } from 'react'
import QuantityField from './QuantityField'

const GET_PRODUCTS_BY_SELECTED_IDS = gql`
query test($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
      id
      totalInventory
      title
      variants(first: 100) {
        edges {
          node {
            title
            barcode
            inventoryQuantity
            price
          }
        }
      }
    }
  }
}`

const SelectedProductsContainer = ({ productIds, updateProductTable, handleQuantityChange, productsTable }) => {

  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_SELECTED_IDS, { variables: productIds, onCompleted: () => updateProductTable(data) });
  if (loading)
    return <center><Spinner accessibilityLabel="Spinner example" size="large" color="teal" /></center>;
  if (error) return (<Card>There was an error...</Card>)

  return (
    <Card title="Selected Products">
      <DataTable
        columnContentTypes={[
          'text',
          'numeric',
          'numeric',
          'numeric',
          'numeric',
          'numeric',
          'numeric',
          'numeric',
          'numeric'
        ]}
        headings={[
          'Title',
          'Variant Barcode',
          'Inventory Available',
          'Unit Price',
          'Unit Cost',
          'Quantity',
          'Total Price',
          'Total Cost',
          'Delete'
        ]}
        rows={productsTable}
      />
    </Card>
  )
}

export default SelectedProductsContainer