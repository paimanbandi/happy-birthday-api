import { Types } from 'mongoose';

export function isValidStringObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}
