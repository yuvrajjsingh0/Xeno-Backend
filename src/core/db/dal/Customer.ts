import { Op, col, fn } from 'sequelize'
import { getSequelizeOperator, sequelize } from '../../utils/utils'
import Customer from '../models/Customer'
import {CustomerInput, CustomerOutput} from '../models/Customer'
import Order from '../models/Order'
import Visit from '../models/Visit'

export const create = async (payload: CustomerInput): Promise<CustomerOutput> => {
    const customer = await Customer.create(payload)
    return customer
}

export const update = async (id: number, payload: Partial<CustomerInput>): Promise<CustomerOutput> => {
    const customer = await Customer.findByPk(id)
    if (!customer) {
        // @todo throw custom error
        throw new Error('not found')
    }
    const updatedCustomer = await (customer as Customer).update(payload)
    return updatedCustomer
}

export const getById = async (id: number): Promise<CustomerOutput> => {
    const customer = await Customer.findByPk(id)
    if (!customer) {
        // @todo throw custom error
        throw new Error('not found')
    }
    return customer
}

export const getByEmail = async (email: string): Promise<CustomerOutput> => {
  const customer = await Customer.findOne({
    where: {
      email: email
    }
  });
  if (!customer) {
      // @todo throw custom error
      throw new Error('not found')
  }
  return customer
}

export const deleteById = async (id: number): Promise<boolean> => {
    const deletedCustomerCount = await Customer.destroy({
        where: {id}
    })
    return !!deletedCustomerCount
}

export const getAll = async (): Promise<CustomerOutput[]> => {
    return Customer.findAll();
}

function buildDynamicQuery(rules:any) {
  const whereClauses: any[] = [];
  const includeClauses: any[] = [];
  const havingClauses: any[] = [];
  const attributes: any = { include: [] };

  rules.forEach((rule:any, index:number) => {
    let condition;

    if (rule.aggregateFunction) {
      const column = rule.column.includes('.') ? rule.column.split('.')[1] : rule.column;
      const sequelizeOperator = getSequelizeOperator(rule.operator);

      if (rule.aggregateFunction === 'SUM' && column === 'amount') {
        includeClauses.push({
          model: Order,
          attributes: [],
          required: true, // Ensure INNER JOIN
        });
        havingClauses.push({
          [Op.and]: [
            sequelize.literal(`SUM(Orders.amount) ${rule.operator} ${rule.value}`)
          ]
        });
        attributes.include.push([fn('SUM', col('Orders.amount')), 'totalAmountSpent']);
      } else if (rule.aggregateFunction === 'COUNT' && column === 'id') {
        const [modelName] = rule.column.split('.');
        includeClauses.push({
          model: sequelize.models[modelName.charAt(0).toUpperCase() + modelName.slice(1)],
          attributes: [],
          required: true, // Ensure INNER JOIN
        });
        havingClauses.push({
          [Op.and]: [
            sequelize.literal(`COUNT(${modelName.charAt(0).toUpperCase() + modelName.slice(1) + "s"}.id) ${rule.operator} ${rule.value}`)
          ]
        });
      } else {
        havingClauses.push({
          [Op.and]: [
            sequelize.literal(`${rule.aggregateFunction}(${column}) ${rule.operator} ${rule.value}`)
          ]
        });
      }
    } else {
      const sequelizeOperator = getSequelizeOperator(rule.operator);
      condition = { [sequelizeOperator]: rule.value };

      if (rule.column.includes('.')) {
        const [modelName, columnName] = rule.column.split('.');
        includeClauses.push({
          model: sequelize.models[modelName.charAt(0).toUpperCase() + modelName.slice(1)],
          attributes: [],
          where: { [columnName]: condition },
          required: true, // Ensure INNER JOIN
        });
      } else {
        whereClauses.push({ [rule.column]: condition });
      }
    }

    if (index > 0 && rule.logicalOp) {
      if (rule.logicalOp === 'OR') {
        if (rule.aggregateFunction) {
          havingClauses[havingClauses.length - 2] = {
            [Op.or]: [havingClauses[havingClauses.length - 2], havingClauses.pop()],
          };
        } else {
          whereClauses[whereClauses.length - 2] = {
            [Op.or]: [whereClauses[whereClauses.length - 2], whereClauses.pop()],
          };
        }
      }
    }
  });

  return {
    include: includeClauses,
    where: whereClauses.length ? { [Op.and]: whereClauses } : {},
    having: havingClauses.length ? { [Op.and]: havingClauses } : {},
    attributes,
    group: ['Customer.id'],
  };
}
  
export async function getCustomersByRules(rules: any) {
    const filterQuery = buildDynamicQuery(rules);
    console.log(filterQuery);
    return await Customer.findAll(filterQuery);
}
  