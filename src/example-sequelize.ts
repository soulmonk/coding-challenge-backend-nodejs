import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
  Sequelize
} from 'sequelize';

// import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize/lib/associations';

class User extends Model {
  public static associations: {
    projects: Association<User, Project>;
  };
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name!: string;
  public preferredName!: string | null; // for nullable fields
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getProjects!: HasManyGetAssociationsMixin<Project>; // Note the null assertions!
  public addProject!: HasManyAddAssociationMixin<Project, number>;
  public hasProject!: HasManyHasAssociationMixin<Project, number>;
  public countProjects!: HasManyCountAssociationsMixin;

  // You can also pre-declare possible inclusions, these will only be populated if you
  public createProject!: HasManyCreateAssociationMixin<Project>;
  // actively include a relation.
  public readonly projects?: Project[]; // Note this is optional since it's only populated when explicitly requested in code
}

const sequelize = new Sequelize('postgres://postgres:root@localhost:5432/challenge');

class Project extends Model {
  public id!: number;
  public ownerId!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

class Address extends Model {
  public userId!: number;
  public address!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED, // you can omit the `new` but this is discouraged
    autoIncrement: true,
    primaryKey: true
  },
  ownerId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  name: {
    type: new DataTypes.STRING(128),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'projects'
});

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: new DataTypes.STRING(128),
    allowNull: false
  },
  preferredName: {
    type: new DataTypes.STRING(128),
    allowNull: true
  }
}, {
  tableName: 'users',
  sequelize: sequelize // this bit is important
});

Address.init({
  userId: {
    type: DataTypes.INTEGER.UNSIGNED
  },
  address: {
    type: new DataTypes.STRING(128),
    allowNull: false
  }
}, {
  tableName: 'addresses',
  sequelize: sequelize // this bit is important
});

// Here we associate which actually populates out pre-declared `association` static and other methods.
User.hasMany(Project, {
  sourceKey: 'id',
  foreignKey: 'ownerId',
  as: 'projects' // this determines the name in `associations`!
});

Address.belongsTo(User, {targetKey: 'id'});
User.hasOne(Address, {sourceKey: 'id'});

async function stuff() {
  await sequelize.sync();
  // Please note that when using async/await you lose the `bluebird` promise context
  // and you fall back to native
  const newUser = await User.create({
    name: 'Johnny',
    preferredName: 'John'
  });
  console.log(newUser.id, newUser.name, newUser.preferredName);

  const project = await newUser.createProject({
    name: 'first!'
  });

  const ourUser = await User.findByPk(1, {
    include: [User.associations.projects],
    rejectOnEmpty: true // Specifying true here removes `null` from the return type!
  });
  console.log(ourUser.projects![0].name); // Note the `!` null assertion since TS can't know if we included
                                          // the model or not
}

// stuff().catch(err => (console.error(err), -1)).then(process.exit);
