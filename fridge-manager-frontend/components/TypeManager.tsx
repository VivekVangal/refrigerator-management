'use client'
import { useState, useEffect } from 'react'
import { ItemType } from "../pages/api/items"

export default function TypeManager() {
  const [types, setTypes] = useState<ItemType[]>([])
  const [isAddingType, setIsAddingType] = useState(false)

  useEffect(() => {
    loadTypes()
  }, [])

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

  return (
    <div>
      <div className="page-header">
        <div className="header-content">
          <div className="flex justify-between items-center mb-4">
            <h1 className="page-title">Manage Item Types</h1>
            <a href="/inventory/manage" className="btn-secondary">
              Back to Inventory
            </a>
          </div>
          <p className="page-description">
            Manage and create new item types for your inventory.
          </p>
        </div>
      </div>

      <div className="page-container">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddingType(true)}
            className="btn-primary"
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

        <div className="ms-table-container">
          <table className="ms-table">
            <thead>
              <tr>
                <th>Type ID</th>
                <th>Display Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type) => (
                <tr key={type.id}>
                  <td className="font-medium">{type.id}</td>
                  <td>{type.name}</td>
                  <td>
                    <span className="status-badge bg-[#dff6dd] text-[#107c10]">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 