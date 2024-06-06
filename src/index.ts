import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const { Pool } = require('pg');
import amqp from 'amqplib';
import startConsumer from './consumer/consumer';

const app = express();
const port = 3000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// RabbitMQ Connection
let channel: amqp.Channel, connection: amqp.Connection;
async function connectRabbitMQ() {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('customerQueue');
    await channel.assertQueue('orderQueue');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
}
connectRabbitMQ();

// Customer API
app.post('/api/customers', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }
  channel.sendToQueue('customerQueue', Buffer.from(JSON.stringify({ name, email })));
  res.status(200).send('Customer data sent to queue');
});

// Order API
app.post('/api/orders', async (req, res) => {
  const { customer_id, product, quantity } = req.body;
  if (!customer_id || !product || !quantity) {
    return res.status(400).send('Customer ID, product, and quantity are required');
  }
  channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify({ customer_id, product, quantity })));
  res.status(200).send('Order data sent to queue');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startConsumer().catch(err => console.log(err));
});