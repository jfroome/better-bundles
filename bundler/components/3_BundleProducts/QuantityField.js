import { TextField } from '@shopify/polaris'
import { useCallback } from 'react'

const QuantityField = (props) => {
    const updateQuantity = useCallback((quantity)=>{ 
        console.log(`quantityField: ${quantity} && ${props.id}`)
        props.handleChange(quantity,props.id)
    },[])

    return (
        <TextField
            type="number"
            onChange={updateQuantity}
            value={props.value}
            align="right"
            min={1}
            max={props.inventoryAvailable}
        />
    )
}
export default QuantityField;