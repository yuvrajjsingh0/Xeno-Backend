import * as orderDal from '../db/dal/Order'
import {OrderInput, OrderOutput} from '../db/models/Order'

export const create = (payload: OrderInput): Promise<OrderOutput> => {
    return orderDal.create(payload)
}
export const update = (id: number, payload: Partial<OrderInput>): Promise<OrderOutput> => {
    return orderDal.update(id, payload)
}
export const getById = (id: number): Promise<OrderOutput> => {
    return orderDal.getById(id)
}
export const deleteById = (id: number): Promise<boolean> => {
    return orderDal.deleteById(id)
}
export const getAll = (): Promise<OrderOutput[]> => {
    return orderDal.getAll()
}