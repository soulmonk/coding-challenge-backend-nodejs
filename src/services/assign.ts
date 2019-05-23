import {Case} from '@models/Case';

export class AssignService {

  static findCase(id: number) {
    return Case.findOne({where: {policeId: id}});
  }
}
