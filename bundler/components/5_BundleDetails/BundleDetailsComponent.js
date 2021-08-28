import {Card, DataTable} from '@shopify/polaris'

const BundleDetailsComponent = (props) => {
    const rows=[[
        props.bundleDetails.BundleTitle,
        props.bundleDetails.Inventory + " available",
        props.bundleDetails.TotalPrice,
        props.bundleDetails.TotalCost
    ]]
    return (
        <Card title="Bundle Details">
            <DataTable
                columnContentTypes={[
                    'text',
                    'numeric',
                    'numeric',
                    'numeric'
                ]}
                headings={[
                    'Bundle Title',
                    'Bundles Available',
                    'Total Price',
                    'Total Cost'
                ]}
                rows={rows}
                showTotalsInFooter
            />
        </Card>
    )
}

export default BundleDetailsComponent