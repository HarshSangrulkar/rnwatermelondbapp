import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'notes',
      columns: [
        { name: 'note', type: 'string' },
        { name: 'desc', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        
      ]
    }),
   
  ]
})