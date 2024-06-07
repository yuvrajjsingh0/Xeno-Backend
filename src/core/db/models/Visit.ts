import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../utils/utils'
import Customer from './Customer';

interface VisitAttributes {
  id: number;
  customer_id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface VisitInput extends Optional<VisitAttributes, 'id'> {}
export interface VisitOutput extends Required<VisitAttributes> {}

class Visit extends Model<VisitAttributes, VisitInput> implements VisitAttributes {
    public id!: number
    public customer_id!: number;
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}
  
Visit.init({
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
    }
  }, {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true
});

  
export default Visit