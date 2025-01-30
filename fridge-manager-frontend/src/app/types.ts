export interface FridgeItem {
    id?: number;
    name: string;
    quantity: number;
    unit: string;
    expiry_date: string;
    category: string;
    storage_location: string;
}

export interface CSVItem {
    Name: string;
    Quantity: string;
    Unit: string;
    "Expiry Date": string;
    Category: string;
    "Storage Location": string;
}