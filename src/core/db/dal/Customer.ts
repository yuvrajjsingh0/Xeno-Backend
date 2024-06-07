import { Op } from 'sequelize'
import { sequelize } from '../../utils/utils'
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

export const deleteById = async (id: number): Promise<boolean> => {
    const deletedCustomerCount = await Customer.destroy({
        where: {id}
    })
    return !!deletedCustomerCount
}

export const getAll = async (): Promise<CustomerOutput[]> => {
    return Customer.findAll();
}

function buildDynamicQuery(rules: any[]) {
    const whereClauses:any = [];
    const includeClauses:any = [];
    const havingClauses:any = [];
  
    rules.forEach((rule, index) => {
        let condition;

        if (rule.aggregateFunction) {
          const column = rule.column.includes('.') ? rule.column.split('.')[1] : rule.column;
          condition = sequelize.literal(`${rule.aggregateFunction}(\`${column}\`) ${rule.operator} ${rule.value}`);
    
          if (rule.column.includes('.')) {
            const [modelName, columnName] = rule.column.split('.');
            includeClauses.push({
              model: sequelize.models[modelName],
              attributes: [],
              where: {},
              required: false,
            });
            havingClauses.push(condition);
          } else {
            havingClauses.push(condition);
          }
        } else {
          condition = { [rule.operator]: rule.value };
    
          if (rule.column.includes('.')) {
            const [modelName, columnName] = rule.column.split('.');
            includeClauses.push({
              model: sequelize.models[modelName],
              attributes: [],
              where: { [columnName]: condition },
              required: false,
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
        group: ['Customer.id'],
    };
}
  
export async function getCustomersByRules(rules: any) {
    const filterQuery = buildDynamicQuery(rules);
    return await Customer.findAll(filterQuery);
}
  