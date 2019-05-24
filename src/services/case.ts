import {ICase} from '@models/Case';

export class CaseService {
  static toPublic(record: ICase) {
    return {
      id: record.id,
      type: record.type
    };
  }

  static list(): ICase[] {
    return [];
  }
}
