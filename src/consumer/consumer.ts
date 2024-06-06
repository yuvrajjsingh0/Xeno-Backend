const { Pool } = require('pg');
const amqp = require('amqplib');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

async function startConsumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  channel.consume('customerQueue', async (msg:any) => {
    const { name, email } = JSON.parse(msg.content.toString());
    await pool.query('INSERT INTO customers (name, email) VALUES ($1, $2)', [name, email]);
    channel.ack(msg);
  });

  channel.consume('orderQueue', async (msg:any) => {
    const { customer_id, product, quantity } = JSON.parse(msg.content.toString());
    await pool.query('INSERT INTO orders (customer_id, product, quantity) VALUES ($1, $2, $3)', [customer_id, product, quantity]);
    channel.ack(msg);
  });

  console.log('Consumers started');
}

export default startConsumer
