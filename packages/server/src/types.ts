import { User } from './entities/mysql/user';

export interface SessionUserType extends Record<string, unknown> {
  id: User['id'];
}
