import amqp from 'amqplib';

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

export { channel, connection }