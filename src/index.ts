const express = require('express');
const bodyParser = require('body-parser');
import amqp from 'amqplib';
import { Request, Response } from 'express';
import startConsumer from './consumer/consumer';
import dbInit from './core/db/init';
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

import * as customerService from './core/services/Customer.service'

const app = express();
app.use(bodyParser.json());

// MySQL Connection using Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql'
});

// Models
const Customer = sequelize.define('Customer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {});

const Order = sequelize.define('Order', {
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  product: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {});

// RabbitMQ Connection
let channel: amqp.Channel, connection;
async function connectRabbitMQ() {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('customerQueue');
    await channel.assertQueue('orderQueue');
    await channel.assertQueue('visitQueue');
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

// Order API
app.post('/api/orders', async (req: Request, res: Response) => {
  const { customer_id, product, quantity } = req.body;
  if (!customer_id || !product || !quantity) {
    return res.status(400).send('Customer ID, product, and quantity are required');
  }
  channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify({ customer_id, product, quantity })));
  res.status(200).send('Order data sent to queue');
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

app.post('/api/customers_by_rules/', async (req: Request, res: Response) => {
  const { rules } = req.body;
  if (!rules) {
    return res.status(400).send('Rules are required');
  }
  res.status(200).send(customerService.getCustomersByRules(rules));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  dbInit();
  startConsumer().catch(err => console.log(err))
});
