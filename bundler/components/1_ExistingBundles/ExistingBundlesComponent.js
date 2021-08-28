import { Spinner, Link, DataTable, Card } from "@shopify/polaris";
import {
  dateFormatter,
  moneyV2Formatter,
  linkFormatter,
} from "../../utilities/Helper";

const displayUnitCostIfNotNull = (currencyCode, unitCost, variantPrice) => {
  if (unitCost != null)
    return moneyV2Formatter(unitCost.currencyCode, unitCost.amount);
  else return "-"; //moneyV2Formatter(currencyCode, variantPrice)
};

const ExistingBundlesComponent = (props) => {
  if (props.loading)
    return (
      <center>
        <Spinner
          accessibilityLabel="Spinner example"
          size="large"
          color="teal"
        />
      </center>
    ); // loading spinner
  if (props.error) return `Error! ${props.error}`;
    console.log(props.data);

  const rowData = props.data.products.edges.map((edge) => {
    var createdAt = dateFormatter(new Date(edge.node.createdAt));
    var updatedAt = dateFormatter(new Date(edge.node.updatedAt));

    return [
      linkFormatter(
        edge.node.title.toString(),
        "https://test-store-please-ignore-999.myshopify.com/admin/products/" +
          edge.node.legacyResourceId.toString()
      ),
      edge.node.status == "ACTIVE" ? "Active" : "Draft",
      edge.node.totalInventory,
      moneyV2Formatter(
        edge.node.priceRange.maxVariantPrice.currencyCode,
        edge.node.variants.edges[0].node.price
      ),
      displayUnitCostIfNotNull(
        edge.node.priceRange.maxVariantPrice.currencyCode,
        edge.node.variants.edges[0].node.inventoryItem.unitCost,
        edge.node.variants.edges[0].node.price
      ),
      createdAt,
      updatedAt,
      // linkFormatter(
      //   "Edit",
      //   "https://test-store-please-ignore-999.myshopify.com/admin/products/" +
      //     edge.node.legacyResourceId.toString()
      // )
      
      "TEST",
    ];
  });
  return (
    <Card title="Current Bundles">
      <DataTable
        columnContentTypes={[
          "text",
          "text",
          "numeric",
          "numeric",
          "numeric",
          "text",
          "text",
          "text",
          "numeric",
        ]}
        headings={[
          "Title",
          "Status",
          "Inventory",
          "Price",
          "Cost",
          "Created",
          "Last Updated",
          "Edit Bundle",
        ]}
        sortable={[true, true, true, true, true, true, true, true, true]}
        defaultSortDirection="descending"
        initialSortColumnIndex={6}
        rows={rowData}
      />
    </Card>
  );
};
export default ExistingBundlesComponent;
