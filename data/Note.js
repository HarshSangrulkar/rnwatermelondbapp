import {Model} from '@nozbe/watermelondb';
import {field, readonly, date} from '@nozbe/watermelondb/decorators';
export default class Note extends Model {
  static table = 'notes';
  @field('note') note;
  @field('desc') desc;
  @readonly @date('created_at') createdAt;
}
