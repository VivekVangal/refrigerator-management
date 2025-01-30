import { FridgeItem } from "../types";


const STORAGE_KEY = 'fridge_items';

export const saveItems = (items: FridgeItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const loadItems = (): FridgeItem[] => {
    const items = localStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
};

export const exportToCSV = (items: FridgeItem[]) => {
    const headers = ['name,quantity,unit,expiry_date,category,storage_location'];
    const csvRows = items.map(item => 
        `${item.name},${item.quantity},${item.unit},${item.expiry_date},${item.category},${item.storage_location}`
    );
    
    const csvContent = [...headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fridge_items.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}; 