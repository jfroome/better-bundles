import { Card, DataTable, Icon } from "@shopify/polaris"
import { DeleteMajor } from '@shopify/polaris-icons';
import Product from './ProductClass'
import { dateFormatter, moneyV2Formatter, linkFormatter } from "../../utilities/Helper"

const SelectedProductsComponent = (props) => {
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
        rows={}
      />
    </Card>
  )
}

export default SelectedProductsComponent