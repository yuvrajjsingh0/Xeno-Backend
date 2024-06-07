import Order from '../models/Order'
import {OrderInput, OrderOutput} from '../models/Order'

export const create = async (payload: OrderInput): Promise<OrderOutput> => {
    const order = await Order.create(payload)
    return order
}

export const update = async (id: number, payload: Partial<OrderInput>): Promise<OrderOutput> => {
    const order = await Order.findByPk(id)
    if (!order) {
        // @todo throw custom error
        throw new Error('not found')
    }
    const updatedOrder = await (order as Order).update(payload)
    return updatedOrder
}

export const getById = async (id: number): Promise<OrderOutput> => {
    const order = await Order.findByPk(id)
    if (!order) {
        // @todo throw custom error
        throw new Error('not found')
    }
    return order
}

export const deleteById = async (id: number): Promise<boolean> => {
    const deletedOrderCount = await Order.destroy({
        where: {id}
    })
    return !!deletedOrderCount
}

export const getAll = async (): Promise<OrderOutput[]> => {
    return Order.findAll();
}