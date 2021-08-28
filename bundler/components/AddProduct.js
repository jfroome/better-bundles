import {
  Page,
  Card,
  PageActions,
  Frame,
  Toast,
  Spinner,
  Banner,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useMutation, gql } from "@apollo/client";

// my components
import SelectProducts from "./3_BundleProducts/SelectProducts";
import SelectedProductsContainer from "./3_BundleProducts/SelectedProductsContainer";
import BundleTitleComponent from "./2_BundleTitle/BundleTitleComponent";
import BundleDetailsComponent from "./5_BundleDetails/BundleDetailsComponent";
import PricingCard from "./4_BundlePricing/PricingCard";
import QuantityField from "./3_BundleProducts/QuantityField";

const CREATE_PRODUCT = gql`
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        title
        onlineStorePreviewUrl 
      }
    }
  }
`;

const AddProduct = (props) => {
  /// Settings & Defaults
  const debug = false;
  const defaultBundleDetails = {
    BundleTitle: BundleTitle,
    Inventory: "0",
    TotalPrice: "0",
    TotalCost: "0",
  };
  const defaultPricing = {
    Price: "0",
    Cost: "0",
    Discount: "0",
    Margin: "0",
  };
  const defaultBundleTitle = "";
  const defaultInventoryUpdateStrat = "onCreate";
  const defaultProductsTable = [];
  const defaultSelectedProductIds = { ids: [] };
  ///

  /// UseState Hooks
  const [BundleTitle, setTitle] = useState(defaultBundleTitle);
  const [InventoryUpdateStrategy, setInventoryStrategy] = useState(
    defaultInventoryUpdateStrat
  );
  const [productsTable, setProductsTable] = useState(defaultProductsTable);
  const [SelectedProductIDs, setSelectedProductIds] = useState(
    defaultSelectedProductIds
  );
  const [bundleDetails, setDetails] = useState(defaultBundleDetails);
  const [pricing, setPricing] = useState(defaultPricing);
  ///

  // Bundle Title Component
  function titleCallBack(newTitle) {
    setTitle(newTitle);
    updateBundleDetails("Title", newTitle);
  }
  function inventoryUpdateStrategyCallback(newInventoryUpdateStrategy) {
    setInventoryStrategy(newInventoryUpdateStrategy);
  }
  //

  // Pricing Card Component
  const updatePricing = (update) => {
    console.log(
      `updatePricing: update.Price=${update.Price} update.Cost=${update.Cost} productsTable=${productsTable}`
    );
    const newPricing = {
      Price: update.Price,
      Cost: update.Cost,
      Discount: updateDiscount(
        calculateTotalProductPrice(productsTable),
        update.Price
      ),
      Margin:
        ((update.Price - update.Cost) / update.Price) * 100 > 0
          ? parseFloat(((update.Price - update.Cost) / update.Price) * 100)
              .toFixed(0)
              .toString()
          : 0,
    };
    setPricing(newPricing);
    updateBundleDetails("Price", update.Price);
    updateBundleDetails("Cost", update.Cost);
    //updateDiscount(calculateTotalProductPrice(productsTable))
  };
  //

  const updateDiscount = (totalProductPrice, newPrice) => {
    const result = (((totalProductPrice - newPrice) / totalProductPrice) * 100)
      .toFixed(0)
      .toString();
    console.log(
      `updateDiscount: totalProductPrice=${totalProductPrice} newPrice=${newPrice} result=${result}`
    );
    return result;
  };

  // Bundle Details Component
  const updateBundleDetails = (target, value) => {
    console.log(`updateBundleDetails: Target=${target} Value=${value}`);
    const newDetails = bundleDetails;
    if (target == "Inventory") {
      newDetails.Inventory = value.toString();
      newDetails.TotalPrice = (parseInt(value) * parseFloat(pricing.Price))
        .toFixed(2)
        .toString();
      newDetails.TotalCost = (parseInt(value) * parseFloat(pricing.Cost))
        .toFixed(2)
        .toString();
    } else if (target == "Title") newDetails.BundleTitle = value.toString();
    else if (target == "Price")
      newDetails.TotalPrice = (
        parseInt(newDetails.Inventory) * parseFloat(value)
      )
        .toFixed(2)
        .toString();
    else if (target == "Cost")
      newDetails.TotalCost = (
        parseInt(newDetails.Inventory) * parseFloat(value)
      )
        .toFixed(2)
        .toString();
    setDetails(newDetails);
  };
  //

  // Select Products
  function selectProductsHandler(resources) {
    console.log(`selectProductsHandler: resources=${resources}`);
    clearProductTable();
    var arrayOfGids = resources.selection.map((product) => product.id);
    setSelectedProductIds({ ids: arrayOfGids });
    console.log(SelectedProductIDs);
  }
  //

  // Selected Products Table
  const updateProductTable = (data) => {
    console.log(`updateProductTable: data=${data}`);
    const newProductsTable = data.nodes.map((product, index) => {
      return {
        id: index,
        title: product.title,
        variantBarcode: product.variants.edges[0].node.barcode,
        inventoryAvailable: product.variants.edges[0].node.inventoryQuantity,
        unitPrice: product.variants.edges[0].node.price,
        unitCost: (product.variants.edges[0].node.price * 0.5)
          .toFixed(2)
          .toString(),
        quantity: "1",
        totalPrice: product.variants.edges[0].node.price,
        totalCost: (product.variants.edges[0].node.price * 0.5)
          .toFixed(2)
          .toString(),
        gid: product.id,
      };
    });
    console.log({ newProductsTable });
    setProductsTable(newProductsTable);
  };

  const clearProductTable = () => {
    setProductsTable([]);
  };

  const handleQuantityChange = (newQuantity, index) => {
    console.log(
      `handleQuantityChange: newQuantity=${newQuantity} index=${index}`
    );
    const newProductsTable = [...productsTable];
    var targetProductIdx = newProductsTable.findIndex(({ id }) => id == index);
    var updatedProduct = newProductsTable[targetProductIdx];
    updatedProduct.quantity = newQuantity;
    updatedProduct.totalPrice = (
      parseInt(newQuantity) * parseFloat(updatedProduct.unitPrice)
    )
      .toFixed(2)
      .toString();
    updatedProduct.totalCost = (
      parseInt(newQuantity) * parseFloat(updatedProduct.unitCost)
    )
      .toFixed(2)
      .toString();
    newProductsTable.splice(targetProductIdx, 1, updatedProduct);
    var newCost = pricing;
    newCost.Cost = newProductsTable.sum("totalCost");
    setProductsTable(newProductsTable);
    updateBundleDetails("Inventory", calculateMaxBundles(newProductsTable));
    updatePricing(newCost);
    //updateDiscount(calculateTotalProductPrice(newProductsTable));
  };

  /// Helper Functions
  const calculateMaxBundles = (table) => {
    console.log(`calculateMaxBundles: table=${table}`);
    var max = table[0].inventoryAvailable / table[0].quantity;
    for (const product of table) {
      if (product.inventoryAvailable / product.quantity < max) {
        max = product.inventoryAvailable / product.quantity;
      }
    }
    return Math.trunc(max);
  };

  // must be called after the product table is updated
  const calculateTotalProductPrice = () => {
    console.log(`calculateTotalProductPrice: table=${productsTable}`);
    var totalProductPrice = 0;
    for (const product of productsTable) {
      totalProductPrice += parseInt(product.totalPrice);
      console.log(
        `calculateTotalProductPrice: product.totalPrice=${product.totalPrice}`
      );
    }

    console.log(`calculateTotalProductPrice: ${totalProductPrice}`);
    return totalProductPrice;
  };

  Array.prototype.sum = function (prop) {
    var total = 0;
    for (var i = 0, _len = this.length; i < _len; i++) {
      total += parseFloat(this[i][prop]);
    }
    return total;
  };
  ///

  // const [toastCreated, setToastCreated] = useState(false);
  // const toggleToastCreated = useCallback(() => setToastCreated((active) => !active), []);
  // const displaytoastCreated = toastCreated ?
  //     <Toast content="Bundle Created" onDismiss={toggleToastCreated} />
  //     : null;

  const [toastFailed, setToastFailed] = useState(false);
  const [toastText, setToastText] = useState("");
  const toggleToastFailed = useCallback(
    () => setToastFailed((active) => !active),
    []
  );
  const displayToastFailed = toastFailed ? (
    <Toast content={toastText} onDismiss={toggleToastFailed} error={true} />
  ) : null;

  const [
    createProduct,
    {
      loading: createProductLoading,
      error: createProductError,
      data: createProductData,
    },
  ] = useMutation(CREATE_PRODUCT);

  const formValidator = () => {
    if (!BundleTitle) {
      setToastText("Title is Required");
      toggleToastFailed();
      return false;
    }
    return true;
  };

  const createProductCallback = useCallback(() => {
    if (formValidator()) {
      createProduct({
        variables: {
          input: {
            title: BundleTitle,
            descriptionHtml: "This is a product Bundle...",
            tags: ["bundle"],
            status: "DRAFT",
          },
        },
      });
      while (createProduct.createProductLoading) {}
      if (createProduct.createProductError) {
        setToastText(`There was an error: ${createProduct.createProductError}`);
        toggleToastFailed();
      } else props.onCreate();
    }
  });

  return (
    <Frame>
      <Page title="Create Bundle" fullWidth>
        <div>
          <BundleTitleComponent
            titleCallBack={titleCallBack}
            inventoryUpdateStrategyCallback={inventoryUpdateStrategyCallback}
          />
          <br />
          <Card>
            <center>
              <SelectProducts onClick={selectProductsHandler} />
            </center>
          </Card>
          <br />

          <SelectedProductsContainer
            productIds={SelectedProductIDs}
            updateProductTable={updateProductTable}
            handleQuantityChange={handleQuantityChange}
            productsTable={productsTable.map((product) => {
              return [
                product.title,
                product.variantBarcode,
                product.inventoryAvailable,
                product.unitPrice,
                product.unitCost,
                <QuantityField
                  id={product.id}
                  handleChange={handleQuantityChange}
                  value={product.quantity}
                  inventoryAvailable={product.inventoryAvailable}
                />,
                product.totalPrice,
                product.totalCost,
                null,
              ];
            })}
          />
          <br />

          <PricingCard pricing={pricing} updatePricing={updatePricing} />

          <br />

          <BundleDetailsComponent bundleDetails={bundleDetails} />
          <br />
          <PageActions
            primaryAction={{
              content: "Create",
              onClick: () => createProductCallback(),
            }}
            secondaryActions={[
              {
                content: "Cancel",
                destructive: true,
                onClick: props.onCancel,
              },
            ]}
          />
          {/* {displaytoastCreated} */}
          {displayToastFailed}
          {debug ? (
            <Card title="debug info">
              <center>
                <h2>The Bundle Title is: {BundleTitle}</h2>
              </center>
              <center>
                <h2>
                  The InventoryUpdateStrategy is: {InventoryUpdateStrategy}
                </h2>
              </center>
              {/* <center><h2>The SelectedProductIDs are: {SelectedProductIDs}</h2></center> */}
              <center>
                <h2>the price is: {pricing.Price}</h2>
              </center>
              <center>
                <h2>the cost is: {pricing.Cost}</h2>
              </center>
              <center>
                <h2>the discount is: {pricing.Discount}</h2>
              </center>
              <center>
                <h2>the margin is: {pricing.Margin}</h2>
              </center>
              <br />
            </Card>
          ) : null}
        </div>
      </Page>
    </Frame>
  );
};

export default AddProduct;
