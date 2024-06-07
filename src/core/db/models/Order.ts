import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../utils/utils'

interface OrderAttributes {
  id: number;
  customer_id: number;
  product: string;
  quantity: number;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface OrderInput extends Optional<OrderAttributes, 'id'> {}
export interface OrderOutput extends Required<OrderAttributes> {}

class Order extends Model<OrderAttributes, OrderInput> implements OrderAttributes {
    public id!: number
    public customer_id!: number;
    public product!: string
    public quantity!: number
    public amount!: number;
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}
  
Order.init({
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
    },
    product: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true
});
  
export default Order