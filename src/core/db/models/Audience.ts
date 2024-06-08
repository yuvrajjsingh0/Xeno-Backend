import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../utils/utils'
import CommunicationLog from './CommunicationLog';

interface AudienceAttributes {
  id: number;
  title: string;
  numUsers: number;
  rules?: string;
  isCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface AudienceInput extends Optional<AudienceAttributes, 'id'> {}
export interface AudienceOutput extends Required<AudienceAttributes> {}

class Audience extends Model<AudienceAttributes, AudienceInput> implements AudienceAttributes {
    public id!: number
    public title!: string;
    public numUsers!: number;
    public rules!: string;
    public isCompleted!: boolean;
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}
  
Audience.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numUsers: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    rules: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
  }, {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true
});
  
Audience.hasMany(CommunicationLog, { foreignKey: 'audience_id' });

export default Audience