import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../utils/utils'

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
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
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