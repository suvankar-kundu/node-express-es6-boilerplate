import * as Collections from '../../common/constants/collections';
import UserSchema from '../schemas/userSchema';

export default function (connection) {
  return connection.model(Collections.User, UserSchema, Collections.User);
}