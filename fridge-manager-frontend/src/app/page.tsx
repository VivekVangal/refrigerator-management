'use client';
import { useState, useEffect } from 'react';
import { FridgeItem } from './types';

export default function Home() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [newItem, setNewItem] = useState<FridgeItem>({
    name: '',
    quantity: 0,
    unit: '',
    expiry_date: '',
    category: '',
    storage_location: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await fetch('http://localhost:8080/api/items');
    const data = await response.json();
    setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:8080/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    });
    fetchItems();
    // Reset form
    setNewItem({
      name: '',
      quantity: 0,
      unit: '',
      expiry_date: '',
      category: '',
      storage_location: ''
    });
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Fridge Manager</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            className="border p-2"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value)})}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Unit"
            value={newItem.unit}
            onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
            className="border p-2"
          />
          <input
            type="datetime-local"
            value={newItem.expiry_date}
            onChange={(e) => setNewItem({...newItem, expiry_date: e.target.value})}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Category"
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Storage Location"
            value={newItem.storage_location}
            onChange={(e) => setNewItem({...newItem, storage_location: e.target.value})}
            className="border p-2"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Add Item
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border p-4 rounded">
            <h3 className="font-bold">{item.name}</h3>
            <p>Quantity: {item.quantity} {item.unit}</p>
            <p>Expires: {new Date(item.expiry_date).toLocaleDateString()}</p>
            <p>Category: {item.category}</p>
            <p>Location: {item.storage_location}</p>
          </div>
        ))}
      </div>
    </main>
  );
}