// roleGrant-model.js
import { DataTypes, Model } from 'sequelize';
import db from '../utils/db.js'; // Assicurati di regolare il percorso di importazione

class RoleGrant extends Model {}

RoleGrant.init(
  {
    id_rolegrant: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role',
        key: 'id_role'
      }
    },
    grant: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Grant',
        key: 'id_grant'
      }
    },
  },
  {
    sequelize: db,
    modelName: 'RoleGrant',
    tableName: 'RoleGrant'
  }
);

export default RoleGrant;
