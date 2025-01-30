'use client'
import { RefrigeratorItem, ItemType } from "../pages/api/items"
import { useState, useEffect } from 'react'

interface RefrigeratorItemsProps {
  viewOnly?: boolean;
}

export default function RefrigeratorItems({ viewOnly = false }: RefrigeratorItemsProps) {
  const [items, setItems] = useState<RefrigeratorItem[]>([])
  const [types, setTypes] = useState<ItemType[]>([])
  const [editItem, setEditItem] = useState<RefrigeratorItem | null>(null)
  const [isAddingType, setIsAddingType] = useState(false)
  
  useEffect(() => {
    loadItems()
    loadTypes()
  }, [])

  const loadItems = async () => {
    const response = await fetch('/api/items')
    const data = await response.json()
    setItems(data)
  }

  const loadTypes = async () => {
    const response = await fetch('/api/types')
    const data = await response.json()
    setTypes(data)
  }

  const addType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newType: ItemType = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
    }

    const response = await fetch('/api/types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newType)
    })
    const updatedTypes = await response.json()
    setTypes(updatedTypes)
    setIsAddingType(false)
    ;(e.target as HTMLFormElement).reset()
  }

  const addItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newItem: RefrigeratorItem = {
      name: formData.get('name') as string,
      quantity: parseInt(formData.get('quantity') as string),
      expiry_date: formData.get('expiry_date') as string,
      type: formData.get('type') as string
    }

    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem)
    })
    const updatedItems = await response.json()
    setItems(updatedItems)
    ;(e.target as HTMLFormElement).reset()
  }

  const updateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editItem) return

    const formData = new FormData(e.currentTarget)
    const updatedItem: RefrigeratorItem = {
      name: formData.get('name') as string,
      quantity: parseInt(formData.get('quantity') as string),
      expiry_date: formData.get('expiry_date') as string,
      type: formData.get('type') as string
    }

    await deleteItem(editItem.name)
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem)
    })
    const updatedItems = await response.json()
    setItems(updatedItems)
    setEditItem(null)
    ;(e.target as HTMLFormElement).reset()
  }

  const deleteItem = async (name: string) => {
    const response = await fetch(`/api/items?name=${name}`, {
      method: 'DELETE'
    })
    const updatedItems = await response.json()
    setItems(updatedItems)
  }

  return (
    <div>
      <div className="page-header">
        <div className="header-content">
          <div className="flex justify-between items-center mb-4">
            <h1 className="page-title">Refrigerator Inventory Manager</h1>
            {viewOnly && (
              <a
                href="/inventory/manage"
                className="btn-primary"
              >
                Manage Inventory
              </a>
            )}
            {!viewOnly && (
              <a
                href="/inventory"
                className="btn-secondary"
              >
                View Inventory
              </a>
            )}
          </div>
          <p className="page-description">
            {viewOnly 
              ? "View your current refrigerator inventory. Monitor quantities and expiry dates."
              : "Track and manage your refrigerator items efficiently. Add new items or update existing ones."}
          </p>
        </div>
      </div>

      <div className="page-container">
        {!viewOnly && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsAddingType(true)}
                className="btn-secondary"
              >
                Add New Type
              </button>
            </div>

            {isAddingType && (
              <div className="form-section mb-6">
                <form onSubmit={addType}>
                  <h2 className="text-xl font-semibold text-[#323130] mb-6">
                    Add New Item Type
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="typeId" className="form-label">
                        Type ID
                      </label>
                      <input
                        id="typeId"
                        type="text"
                        name="id"
                        placeholder="Enter type ID (lowercase, no spaces)"
                        required
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="typeName" className="form-label">
                        Type Name
                      </label>
                      <input
                        id="typeName"
                        type="text"
                        name="name"
                        placeholder="Enter display name"
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button type="submit" className="btn-primary">
                        Add Type
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingType(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            <div className="form-section">
              <form onSubmit={editItem ? updateItem : addItem}>
                <h2 className="text-xl font-semibold text-[#323130] mb-6">
                  {editItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h2>
                <div className="form-grid">
                  <div>
                    <label htmlFor="name" className="form-label">
                      Item Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter item name"
                      defaultValue={editItem?.name}
                      required
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="form-label">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      defaultValue={editItem?.type || types[0]?.id}
                      required
                      className="form-input"
                    >
                      {types.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="quantity" className="form-label">
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      name="quantity"
                      placeholder="Enter quantity"
                      defaultValue={editItem?.quantity}
                      required
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="expiry_date" className="form-label">
                      Expiry Date
                    </label>
                    <input
                      id="expiry_date"
                      type="date"
                      name="expiry_date"
                      defaultValue={editItem?.expiry_date}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button type="submit" className="btn-primary">
                      {editItem ? 'Save' : 'Add'} Item
                    </button>
                    {editItem && (
                      <button
                        type="button"
                        onClick={() => setEditItem(null)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Items Table */}
        <div className="ms-table-container">
          <table className="ms-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                {!viewOnly && (
                  <th className="text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name}>
                  <td className="font-medium">{item.name}</td>
                  <td>
                    <span className="status-badge bg-[#f3f2f1] text-[#323130]">
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      item.quantity <= 2 ? 'status-low' : 'status-good'
                    }`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>{new Date(item.expiry_date).toLocaleDateString()}</td>
                  {!viewOnly && (
                    <td className="text-right space-x-2">
                      <button
                        onClick={() => setEditItem(item)}
                        className="btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.name)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 