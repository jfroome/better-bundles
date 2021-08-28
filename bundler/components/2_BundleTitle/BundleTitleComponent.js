import { Card, TextField, RadioButton, Stack } from '@shopify/polaris'
import React, {useState, useCallback} from 'react'


const BundleTitleComponent = (props) => {

    const [title,setTitle] = useState("");
    const [radio,setRadio] = useState("onCreate");
    const handleTitleChange = useCallback((newTitle) => 
    {
        setTitle(newTitle)
        props.titleCallBack(newTitle)
    }, []);
    
    const handleRadioOnCreate = useCallback(() => 
    {
        setRadio("onCreate")
        props.inventoryUpdateStrategyCallback("onCreate")
    }, []);

    const handleRadioOnSold = useCallback(() =>
    {
        setRadio("onSold")
        props.inventoryUpdateStrategyCallback("onSold")
    }, []); 

    return (
        <Card sectioned title="Bundle Settings">
            <TextField 
                label="Title" 
                value={title}
                onChange={handleTitleChange}
                helpText="Name your bundle"
            />
            <br />
            <Stack>
                <RadioButton
                    label="Update Inventory on Bundle Creation"
                    helpText="This will update the child product inventory levels immediately after product creation."
                    checked={radio === "onCreate"} 
                    id="UpdateInventoryOnCreate"
                    onChange={handleRadioOnCreate}
                    value={radio}
                />
                <RadioButton
                    label="Update Inventory on Bundle Sold"
                    helpText="This will only update the child product inventory levels after a bundle is sold."
                    id="UpdateInventoryOnSold"
                    checked={radio === "onSold"} 
                    onChange={handleRadioOnSold}
                    value={radio}
                />
            </Stack>
        </Card>
    )
}

export default BundleTitleComponent