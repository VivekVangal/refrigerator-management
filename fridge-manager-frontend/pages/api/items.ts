import { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

export interface ItemType {
  id: string;
  name: string;
}

export interface RefrigeratorItem {
  name: string;
  quantity: number;
  expiry_date: string;
  type: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const csvPath = path.join(process.cwd(), 'data', 'refrigerator_items.csv');
  const typesPath = path.join(process.cwd(), 'data', 'item_types.csv');

  // Handle types endpoints
  if (req.url?.includes('/api/types')) {
    if (req.method === 'GET') {
      try {
        const fileContent = await fs.readFile(typesPath, 'utf-8');
        const types = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        }) as ItemType[];
        
        res.status(200).json(types);
      } catch (error) {
        res.status(200).json([]); // Return empty array if file doesn't exist
      }
    }

    if (req.method === 'POST') {
      try {
        const newType = req.body;
        let types: ItemType[] = [];
        
        try {
          const fileContent = await fs.readFile(typesPath, 'utf-8');
          types = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
          }) as ItemType[];
        } catch (error) {
          // File doesn't exist yet, start with empty array
        }

        types.push(newType);
        
        await fs.writeFile(
          typesPath,
          stringify(types, { header: true })
        );
        
        res.status(200).json(types);
      } catch (error) {
        res.status(500).json({ error: 'Failed to save type' });
      }
    }

    return;
  }

  if (req.method === 'GET') {
    try {
      const fileContent = await fs.readFile(csvPath, 'utf-8')
      const items = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      }) as RefrigeratorItem[]
      
      res.status(200).json(items)
    } catch (error) {
      res.status(200).json([]) // Return empty array if file doesn't exist yet
    }
  }

  if (req.method === 'POST') {
    try {
      const newItem = req.body
      let items: RefrigeratorItem[] = []
      
      try {
        const fileContent = await fs.readFile(csvPath, 'utf-8')
        items = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        }) as RefrigeratorItem[]
      } catch (error) {
        // File doesn't exist yet, start with empty array
      }

      items.push(newItem)
      
      await fs.writeFile(
        csvPath,
        stringify(items, { header: true })
      )
      
      res.status(200).json(items)
    } catch (error) {
      res.status(500).json({ error: 'Failed to save item' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { name } = req.query
      const fileContent = await fs.readFile(csvPath, 'utf-8')
      let items = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      }) as RefrigeratorItem[]

      items = items.filter(item => item.name !== name)
      
      await fs.writeFile(
        csvPath,
        stringify(items, { header: true })
      )
      
      res.status(200).json(items)
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete item' })
    }
  }
} 