import { TextField } from "@shopify/polaris"
import { useState, useCallback } from 'react'


"use strict";

class Product {
    Id;
    Index;
    Title;
    Barcode;
    Inv;
    Price;
    Cost;
    TotalPrice;
    TotalCost;
    Index;
    UpdateQuantity;

    constructor(Id, Index, Title, Barcode, Inv, Price, Cost, Quantity, TotalPrice, TotalCost, UpdateQuantity) {
        this.Id = Id
        this.Index = Index
        this.Title = Title
        this.Barcode = Barcode
        this.Inv = Inv
        this.Price = Price
        this.Cost = Cost
        this.TotalPrice = TotalPrice 
        this.TotalCost = TotalCost
        this.Quantity = "1"
        this.UpdateQuantity = UpdateQuantity
    }

    toArray() {
        return [
            this.Title,
            this.Barcode,
            this.Inv + " available",
            this.Price,
            this.Cost,
            <TextField
                key={this.Id}
                type='number'
                value={this.Quantity}
                onChange={this.UpdateQuantity(this.Index, this.Quantity)}
                min="0"
                max={this.Inv}
            />,
            this.TotalPrice,
            this.TotalCost
        ]
    }

    // quantityField() {

    //     const [value, setValue] = useState('1');

    //     const handleChange = useCallback((newValue) => setValue(newValue), []);

    //     return (
    //         <TextField
    //             label="Quantity"
    //             type="number"
    //             value={value}
    //             onChange={handleChange}
    //         />
    //     );
    // }

    toString() {
        return "Product: " +
            this.Id + " " +
            this.Title + " " +
            this.Barcode + " " +
            this.Inv + " available" + " " +
            this.Price + " " +
            this.Cost + " " +
            "<TextField.... />" + " " +
            this.TotalPrice + " " +
            this.TotalCost
    }

    // updateQuantity(newQuantity) {
    //     if (newQuantity <= this.Inv)
    //         this.Quantity = newQuantity
    //     else
    //         this.Quantity = this.Inv
    //     setQuantity(newQuantity)
    // }
}
export default Product