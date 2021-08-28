import {
  Heading,
  Button,
  Layout,
  Page,
  Card,
  Banner,
  Toast,
  Frame,
} from "@shopify/polaris";
import { gql, useQuery } from '@apollo/client';

// my components
import AddProduct from "../components/AddProduct";
import ExistingBundlesComponent from "../components/1_ExistingBundles/ExistingBundlesComponent";
import { useState, useCallback } from "react";
import { ApolloProvider } from '@apollo/client';

const GET_DASHBOARD_ITEMS = gql`
  query {
    products(
      query: "tag:*(bundle)*"
      first: 100
      sortKey: CREATED_AT
      reverse: true
    ) {
      edges {
        node {
          id
          legacyResourceId
          title
          onlineStorePreviewUrl
          totalInventory
          createdAt
          updatedAt
          status
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                price
                availableForSale
                inventoryItem {
                  unitCost {
                    currencyCode
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const Index = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showExisting, setShowExisting] = useState(true);
  const [showBundleCreatedInfo, setShowBundleCreatedInfo] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const toggleToast = useCallback(() => setToast((active) => !active), []);
  const displayToast = toast ? (
    <Toast
      content={toastText}
      onDismiss={toggleToast}
    // duration={10}
    />
  ) : null;

  const onClick = () => {
    setShowExisting(!showExisting);
    setShowAddProduct(!showAddProduct);
  };

  const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_ITEMS, {
    notifyOnNetworkStatusChange: true,
    pollInterval: 15000,
  });

  const onCreate = () => {
    setShowBundleCreatedInfo(true);
    setToastText("Bundle Created");
    toggleToast();
    setShowAddProduct(!showAddProduct);
    setShowExisting(!showExisting);
    setShowAddProduct(!showAddProduct);
    //refetch()
  };

  return (
    <Frame>
      {/* <link
        rel="stylesheet"
        href="https://unpkg.com/@shopify/polaris@6.6.0/dist/styles.css"
      /> */}
      {showExisting ? (
        <Page title="Better Bundles" fullWidth>
          <Button fullWidth primary onClick={onClick}>
            {" "}
            Create new Bundle
          </Button>
          <br />
          {showBundleCreatedInfo ? (
            <div>
              <Banner
                title={`Your new bundle will appear below shortly`}
                status="info"
                onDismiss={() => setShowBundleCreatedInfo(false)}
              />
            </div>
          ) : null}
          <ExistingBundlesComponent
            loading={loading}
            error={error}
            data={data}
          />
          {displayToast}
        </Page>
      ) : null}
      {showAddProduct ? (
        <AddProduct onCancel={onClick} onCreate={onCreate} />
      ) : null}
    </Frame>
  );
};
export default Index;