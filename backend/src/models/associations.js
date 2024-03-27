import Role from './role.js';
import Grant from './grant.js';
import User from './user.js';
import RoleGrant from './rolegrant.js';
import Group from './group.js';
import Subgroup from './subgroup.js';
import ContractType from './contracttype.js';
import Invoice from './invoice.js';
import Company from './company.js';
import WorkingSite from './workingsite.js';

// Define associations
User.belongsTo(Role, { foreignKey: 'role' });
Role.hasMany(User, { foreignKey: 'role' });

Role.belongsToMany(Grant, { through: RoleGrant, foreignKey: 'role' });
Grant.belongsToMany(Role, { through: RoleGrant, foreignKey: 'grant' });

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
    Grant,
    RoleGrant,
    ContractType,
  };