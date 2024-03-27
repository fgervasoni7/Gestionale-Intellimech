// rolegrant-model.js
import { DataTypes, Model } from 'sequelize';
import db from '../utils/db.js';

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
      allowNull: false
    },
    grant: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize: db,
    modelName: 'RoleGrant',
    tableName: 'rolegrant',
    timestamps: false // Disable timestamps
  }
);

export default RoleGrant;
