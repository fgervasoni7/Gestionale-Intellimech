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
    createdBy: {
      type: DataTypes.INTEGER, // Assuming createdBy is the ID of the user who created the role
      references: {
        model: User, // Adjust the model name if needed
        key: 'id_user'
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedBy: {
      type: DataTypes.INTEGER, // Assuming updatedBy is the ID of the user who updated the role
      references: {
        model: User, // Adjust the model name if needed
        key: 'id_user'
      }
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedBy: {
      type: DataTypes.INTEGER, // Assuming deletedBy is the ID of the user who deleted the role
      references: {
        model: User, // Adjust the model name if needed
        key: 'id_user'
      },
      allowNull: true
    }
  },
  {
    sequelize: db,
    modelName: 'Role',
    tableName: 'Role', // Adjust the table name if needed
    paranoid: true, // Enable soft delete
  }
);

export default Role;