import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../utils/utils'
import Order from './Order';
import Visit from './Visit';
import CommunicationLog from './CommunicationLog';

interface CustomerAttributes {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface CustomerInput extends Optional<CustomerAttributes, 'id'> {}
export interface CustomerOutput extends Required<CustomerAttributes> {}

class Customer extends Model<CustomerAttributes, CustomerInput> implements CustomerAttributes {
    public id!: number
    public name!: string
    public email!: string
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}
  
Customer.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true
});

  
export default Customer