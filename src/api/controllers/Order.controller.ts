import { RequestHandler } from 'express';
import * as orderService from '../../core/services/Order.service';
import { channel } from '../utils/rabbitmq';

export const createOrder: RequestHandler = (req, res, next) => {
    const { customer_id, product, quantity } = req.body;
    if (!customer_id || !product || !quantity) {
      return res.status(400).send('Customer ID, product, and quantity are required');
    }
    channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify({ customer_id, product, quantity })));
    res.status(200).send('Order data sent to queue');
}

export const getOrders: RequestHandler = async (req, res, next) => {
    res.status(200).send(await orderService.getAll());
}

export const getOrderById: RequestHandler = async (req, res, next) => {
    res.status(200).send(await orderService.getById(Number(req.params.id)));
}