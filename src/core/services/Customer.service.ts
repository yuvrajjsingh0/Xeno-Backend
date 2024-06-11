import * as customerDal from '../db/dal/Customer'
import {CustomerInput, CustomerOutput} from '../db/models/Customer'

export const create = (payload: CustomerInput): Promise<CustomerOutput> => {
    return customerDal.create(payload)
}
export const update = (id: number, payload: Partial<CustomerInput>): Promise<CustomerOutput> => {
    return customerDal.update(id, payload)
}
export const getById = (id: number): Promise<CustomerOutput> => {
    return customerDal.getById(id)
}
export const deleteById = (id: number): Promise<boolean> => {
    return customerDal.deleteById(id)
}
export const getAll = (): Promise<CustomerOutput[]> => {
    return customerDal.getAll()
}

export const getCustomersByRules = (rules: any): Promise<CustomerOutput[]> => {
    return customerDal.getCustomersByRules(rules);
}

export const getCustomerEmail = (email: any): Promise<CustomerOutput> => {
    return customerDal.getByEmail(email);
}