// grant-model.js
import { DataTypes, Model } from 'sequelize';
import db from '../utils/db.js'; // Assicurati di regolare il percorso di importazione

class Grant extends Model {}

Grant.init(
  {
    id_grant: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    endpoint: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize: db,
    modelName: 'Grant',
    tableName: 'Grant'
  }
);

export default Grant;
