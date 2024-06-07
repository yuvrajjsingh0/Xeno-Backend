import { Op, Sequelize } from "sequelize";

const sequelize: Sequelize = new Sequelize(process.env.DATABASE_URL || '', {
    dialect: 'mysql'
});

const getSequelizeOperator = (operator: string) => {
    switch (operator) {
      case '>':
        return Op.gt;
      case '<':
        return Op.lt;
      case '>=':
        return Op.gte;
      case '<=':
        return Op.lte;
      case '=':
        return Op.eq;
      case '!=':
        return Op.ne;
      case 'IN':
        return Op.in;
      case 'NOT IN':
        return Op.notIn;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
}

export { sequelize, getSequelizeOperator }