// grant-model.js
import { DataTypes, Model } from 'sequelize';
import db from '../utils/db.js';

class Grant extends Model {}

Grant.init(
  {
    id_grant: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    endpoint: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    sequelize: db,
    modelName: 'Grant',
    tableName: 'grant',
    timestamps: false // Disable timestamps
  }
);

export default Grant;
