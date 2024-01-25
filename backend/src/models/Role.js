// role-model.js
import { DataTypes, Model } from 'sequelize';
import db from '../utils/db.js'; // Adjust the path accordingly
import User from './User.js'; // Import User model

class Role extends Model {}

Role.init(
  {
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    isDelete: {
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    sequelize: db,
    modelName: 'Role',
    tableName: 'Role', // Adjust the table name if needed
    paranoid: true, // Enable soft delete
  }
);

export default Role;