import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {mySchema} from './schema';
import { Database } from '@nozbe/watermelondb';
import Note from './Note';
mySchema;
const adapter = new SQLiteAdapter({
  schema: mySchema,
});

export const database=new Database({
    adapter,
    modelClasses:[Note],
    actionEnabled:true
})
