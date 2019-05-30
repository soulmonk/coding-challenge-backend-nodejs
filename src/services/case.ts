import {Case, ICase} from '@models/Case';
import {Op} from 'sequelize';
import {AssignService} from './assign';

export class CaseService {
  static toPublic(record: ICase) {
    return {
      id: record.id,
      type: record.type,
      ownerName: record.ownerName,
      licenseNumber: record.licenseNumber,
      color: record.color,
      theftDescription: record.theftDescription,
      date: record.date,
      resolved: record.resolved,

      createdAt: record.createdAt,
      updatedAt: record.updatedAt,

      policeOfficerName: record.policeOfficerName || (record.officer && record.officer.fullName) || null
    };
  }

  static async list(query: {[key: string]: string | number}): Promise<ICase[]> {
    const where: any = {};

    if (query.ownerName) {
      where.ownerName = {[Op.substring]: query.ownerName};
    }
    if (query.type) {
      where.type = query.type;
    }
    if (query.color) {
      where.color = query.color;
    }
    if (query.resolved) {
      where.resolved = query.resolved;
    }
    if (query.officerId !== undefined) {
      if (query.officerId === '') {
        where.officerId = {[Op.eq]: null};
      } else {
        where.officerId = query.officerId;
      }
    }

    const records = await Case.findAll({where, include: [Case.associations.officer]});
    return records.map(this.toPublic);
  }

  static async create(data: ICase): Promise<ICase> {
    const record = await Case.create(data);

    const availablePoliceOfficer = await AssignService.findAvailableOfficer();
    if (availablePoliceOfficer) {
      availablePoliceOfficer.setCase(record);
      record.policeOfficerName = availablePoliceOfficer.fullName;
    }
    return this.toPublic(record);
  }

  static async resolve(id: number): Promise<ICase | false> {
    const record = await Case.findByPk(id);

    if (!record) {
      return false;
    }

    const assignPoliceOfficer = await record.getOfficer();
    if (!assignPoliceOfficer) {
      throw new Error('Could not resolve case without officer officer');
    }

    record.resolved = true;
    record.officerId = null; // todo do we need for history?

    const saved = await record.save();

    const availableCase = await AssignService.findUnassignedCase();
    if (availableCase) {
      await assignPoliceOfficer.setCase(availableCase);
    }

    return this.toPublic(saved);
  }
}
