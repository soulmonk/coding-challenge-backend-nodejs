import {Case, ICase} from '@models/Case';
import {Police} from '@models/Police';

export class CaseService {
  static toPublic(record: ICase) {
    return {
      id: record.id,
      type: record.type,
      ownerName: record.ownerName,
      licenseNumber: record.licenseNumber,
      color: record.color,
      theftDescription: record.theftDescription,
      resolved: record.resolved,

      createdAt: record.createdAt,
      updatedAt: record.updatedAt,

      policeOfficerName: record.policeOfficerName || (record.police && record.police.fullName) || null
    };
  }

  static async list(): Promise<ICase[]> {
    const records = await Case.findAll({include: [Case.associations.police]});
    return records.map(this.toPublic);
  }

  static async create(data: ICase): Promise<ICase> {
    const record = await Case.create(data);
    // todo auto assign
    // find available
    return this.toPublic(record);
  }

  static async resolve(id: number): Promise<ICase | false> {
    const record = await Case.findByPk(id);

    if (!record) {
      return false;
    }

    const assignPoliceOfficer = await record.getPolice();
    if (!assignPoliceOfficer) {
      throw new Error('Could not resolve case without police officer');
    }

    record.resolved = true;
    record.policeId = null; // todo do we need for history?

    // todo auto assign police officer for not assign case

    const saved = await record.save();

    return this.toPublic(saved);
  }
}
