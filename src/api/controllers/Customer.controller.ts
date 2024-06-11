import { RequestHandler } from 'express';
import * as customerService from '../../core/services/Customer.service';
import { channel } from '../utils/rabbitmq';

export const createCustomer:RequestHandler = async (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).send({error: 'Name and email are required'});
    }
    try{
        await customerService.getCustomerEmail(email);
        res.status(400).send({error: 'Customer Already exists'});
    }catch(err){
        channel.sendToQueue('customerQueue', Buffer.from(JSON.stringify({ name, email })));
        res.status(200).send({success: 'Customer data sent to queue'});
    }
};

export const getCustomers: RequestHandler = async (req, res, next) => {
    res.status(200).send(await customerService.getAll());
}

export const getCustomerById: RequestHandler = async (req, res, next) => {
    res.status(200).send(await customerService.getById(Number(req.params.id)));
}

export const getCustomersByRules: RequestHandler = async (req, res, next) => {
    const { rules } = req.body;
    if (!rules) {
        return res.status(400).send({error: 'Rules are required'});
    }
    res.status(200).send(await customerService.getCustomersByRules(rules));
}