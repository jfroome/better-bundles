import { Card, TextField, Stack, Checkbox } from "@shopify/polaris"
import { useCallback } from 'react'

const PricingCard = (props) => {
    const priceHandler = useCallback((price) => {
        var newPricing = props.pricing
        newPricing.Price = price
        props.updatePricing(newPricing)
    }, [])

    // const costHandler = useCallback((cost) => {
    //     var newPricing = props.pricing
    //     newPricing.Cost = cost
    //     props.updatePricing(newPricing)
    // }, [])

    return (
        <Card
            title="Determine Bundle Pricing"
            sectioned>
            <Stack
                distribution="trailing"
            >
            </Stack>
            <Stack
                extraloose
                distribution="fill"
            >
                <TextField
                    helpText="Price your Bundle"
                    label="Price"
                    type="number"
                    prefix="$"
                    onChange={priceHandler}
                    align="right"
                    value={props.pricing.Price}
                    inputMode="numeric"
                    maxLength="20"
                    min="0"
                    max="100000000"
                ></TextField>
                <TextField
                    helpText="How much did the items cost you?"
                    label="Cost"
                    prefix="$"
                    value={props.pricing.Cost.toString()}
                    align="right"
                    inputMode="numeric"
                    maxLength="20"
                    min="0"
                    max="100000000"
                    readOnly
                ></TextField>
            </Stack>
            <br />
            <Stack
                extraloose
                distribution="fill"
            >
                <TextField
                    helpText="Item Price vs. Bundle Price"
                    key={props.pricing.Discount}
                    label="Discount"
                    prefix="%"
                    value={props.pricing.Discount.toString()}
                    readOnly
                    align="right"
                    maxLength="20"
                ></TextField>

                <TextField
                    helpText="Price - Cost / Price * 100 %"
                    key={props.pricing.Margin}
                    label="Margin"
                    prefix="%"
                    value={props.pricing.Margin.toString()}
                    align="right"
                    maxLength="20"
                    readOnly
                >
                </TextField>
            </Stack>
        </Card>
    )
}

export default PricingCard



