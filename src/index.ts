const express = require('express');
const bodyParser = require('body-parser');
import amqp from 'amqplib';
import { Request, Response } from 'express';
import startConsumer from './consumer/consumer';
import dbInit from './core/db/init';
require('dotenv').config();

import * as customerService from './core/services/Customer.service'
import * as orderService from './core/services/Order.service'
import * as audienceService from './core/services/Audience.service'
import * as communicationLogService from './core/services/CommunicationLog.service'
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors())

// RabbitMQ Connection
let channel: amqp.Channel, connection;
async function connectRabbitMQ() {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('customerQueue');
    await channel.assertQueue('orderQueue');
    await channel.assertQueue('visitQueue');
    await channel.assertQueue('audienceQueue');
    await channel.assertQueue('communicationQueue');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
}
connectRabbitMQ();

// Customer API
app.post('/api/customers', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }
  channel.sendToQueue('customerQueue', Buffer.from(JSON.stringify({ name, email })));
  res.status(200).send('Customer data sent to queue');
});

app.get('/api/customers', async (req: Request, res: Response) => {
  res.status(200).send(await customerService.getAll());
});

app.get('/api/customer/:id', async (req: Request, res: Response) => {
  res.status(200).send(await customerService.getById(Number(req.params.id)));
});

// Order API
app.post('/api/orders', async (req: Request, res: Response) => {
  const { customer_id, product, quantity } = req.body;
  if (!customer_id || !product || !quantity) {
    return res.status(400).send('Customer ID, product, and quantity are required');
  }
  channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify({ customer_id, product, quantity })));
  res.status(200).send('Order data sent to queue');
});

app.get('/api/orders', async (req: Request, res: Response) => {
  res.status(200).send(await orderService.getAll());
});

app.get('/api/order/:id', async (req: Request, res: Response) => {
  res.status(200).send(await orderService.getById(Number(req.params.id)));
});

// Visit API
app.post('/api/visits', async (req: Request, res: Response) => {
  const { customer_id } = req.body;
  if (!customer_id) {
    return res.status(400).send('Customer ID is required');
  }
  channel.sendToQueue('visitQueue', Buffer.from(JSON.stringify({ customer_id })));
  res.status(200).send('Visit data sent to queue');
});

app.post('/api/customers_by_rules', async (req: Request, res: Response) => {
  const { rules } = req.body;
  if (!rules) {
    return res.status(400).send('Rules are required');
  }
  res.status(200).send(await customerService.getCustomersByRules(rules));
});

app.get('/api/audiences', async (req: Request, res: Response) => {
  res.status(200).send(await audienceService.getAll());
});

app.post('/api/audiences', async (req: Request, res: Response) => {
  const { title, numUsers, rules } = req.body;
  if (!title || !numUsers || !rules) {
    return res.status(400).send({error: 'Title, Number of Users, and Rules are required'});
  }
  channel.sendToQueue('audienceQueue', Buffer.from(JSON.stringify({ title, numUsers, rules })));
  res.status(200).send('Audience data sent to queue');
});

app.get('/api/audience/:id', async (req: Request, res: Response) => {
  res.status(200).send(await audienceService.getById(Number(req.params.id)));
});

app.post('/api/audience/:id/startCampaign', async (req: Request, res: Response) => {
  channel.sendToQueue('communicationQueue', Buffer.from(JSON.stringify({ audienceId: req.params.id })));
  res.status(200).send('communication data sent to queue');
});

app.get('/api/audience/:id/campaignLog', async (req: Request, res: Response) => {
  res.status(200).send(await communicationLogService.getByAudienceId(Number(req.params.id)));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  dbInit();
  //generateDummyData();
  startConsumer().catch(err => console.log(err));
});
