import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../utils/utils'
import Customer from './Customer';
import Audience from './Audience';

interface CommunicationLogAttributes {
  id: number;
  customer_id: number;
  audience_id: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface CommunicationLogInput extends Optional<CommunicationLogAttributes, 'id'> {}
export interface CommunicationLogOutput extends Required<CommunicationLogAttributes> {}

class CommunicationLog extends Model<CommunicationLogAttributes, CommunicationLogInput> implements CommunicationLogAttributes {
    public id!: number
    public customer_id!: number;
    public audience_id!: number;
    public status!: string;
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}
  
CommunicationLog.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: Customer,
          key: 'id'
        },
        onDelete: 'CASCADE'
    },
    audience_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Audience,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  }, {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true
});

  
export default CommunicationLog