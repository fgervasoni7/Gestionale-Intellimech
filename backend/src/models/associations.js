import Role from './role.js';
import Permissions from './permissions.js';
import User from './user.js';
import rolepermissions from './rolepermissions.js';
import Group from './group.js';
import Subgroup from './subgroup.js';
import ContractType from './contracttype.js';
import Invoice from './invoice.js';
import Company from './company.js';
import WorkingSite from './workingsite.js';

// Define associations
User.belongsTo(Role, { foreignKey: 'role' });
Role.hasMany(User, { foreignKey: 'role' });

Role.belongsToMany(Permissions, { through: rolepermissions, foreignKey: 'id_role' });
Permissions.belongsToMany(Role, { through: rolepermissions, foreignKey: 'id_permissions' });

//User is associated with Group
User.belongsTo(Group, { foreignKey: 'group' });
Group.hasMany(User, { foreignKey: 'group' });

//User is associated with Subgroup
User.belongsTo(Subgroup, { foreignKey: 'subgroup' });
Subgroup.hasMany(User, { foreignKey: 'subgroup' });

//User is associated with ContractType
User.belongsTo(ContractType, { foreignKey: 'contracttype' });
ContractType.hasMany(User, { foreignKey: 'contracttype' });

//Role is associated with User in the createdBy, updatedBy, and deletedBy fields
Role.hasMany(User, { foreignKey: 'createdBy' });
Role.hasMany(User, { foreignKey: 'updatedBy' });
Role.hasMany(User, { foreignKey: 'deletedBy' });

//ContractType is associated with User in the createdBy, updatedBy, and deletedBy fields
ContractType.hasMany(User, { foreignKey: 'createdBy' });
ContractType.hasMany(User, { foreignKey: 'updatedBy' });
ContractType.hasMany(User, { foreignKey: 'deletedBy' });

//Invoice is associated with the Company in the Invoicecompany by id_company
Invoice.belongsTo(Company, { foreignKey: 'invoicecompany' });
Company.hasMany(Invoice, { foreignKey: 'invoicecompany' });

//User is associated with WorkingSite
User.belongsTo(WorkingSite, { foreignKey: 'workingsite' });
WorkingSite.hasMany(User, { foreignKey: 'workingsite' });


export default {
    User,
    Role,
    Permissions,
    rolepermissions,
    ContractType,
  };