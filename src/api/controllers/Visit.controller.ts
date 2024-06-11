import { RequestHandler } from 'express';
import { channel } from '../utils/rabbitmq';

export const createVisit: RequestHandler = (req, res, next) => {
    const { customer_id } = req.body;
    if (!customer_id) {
        return res.status(400).send('Customer ID is required');
    }
    channel.sendToQueue('visitQueue', Buffer.from(JSON.stringify({ customer_id })));
    res.status(200).send('Visit data sent to queue');
}