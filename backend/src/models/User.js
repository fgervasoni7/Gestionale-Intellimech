// user-model.js
import { DataTypes, Model } from 'sequelize';
import db from '../utils/db.js';
import Role from './Role.js';

class User extends Model {}

User.init(
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthdate: {
      type: DataTypes.DATE
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role', // Usa il nome della tabella invece del modello
        key: 'id_role'
      }
    },
    isdeleted: {
      type: DataTypes.BOOLEAN
    },
    isActive: {
      type: DataTypes.BOOLEAN
    },
    lastLogin: {
        type: DataTypes.DATE
    },
    lastLoginIp: {
        type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    addedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id_user'
      }
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id_user'
      }
    }
  },
  {
    sequelize: db,
    modelName: 'User',
    tableName: 'User'
  }
);

export default User;
