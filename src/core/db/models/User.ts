import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../utils/utils'
import Customer from './Customer';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  authSource: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface UserInput extends Optional<UserAttributes, 'id'> {}
export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number
    public name!: string;
    public email!: string;
    public authSource!: string;
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}
  
User.init({
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
    },
    authSource: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true
});

  
export default User