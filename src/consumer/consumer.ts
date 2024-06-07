import amqp from 'amqplib';
require('dotenv').config();

import * as customerService from '../core/services/Customer.service'
import * as orderService from '../core/services/Order.service'
import * as visitService from '../core/services/Visit.service'

async function startConsumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  channel.consume('customerQueue', async (msg: any) => {
    const { name, email } = JSON.parse(msg.content.toString());
    try{
      await customerService.create({name, email});
    }catch(err){
      console.log(err);
    }
    channel.ack(msg);
  });

  channel.consume('orderQueue', async (msg: any) => {
    const { customer_id, product, quantity, amount } = JSON.parse(msg.content.toString());
    try{
      await orderService.create({customer_id, product, quantity, amount});
    }catch(err){
      console.log(err);
    }
    channel.ack(msg);
  });

  channel.consume('visitQueue', async (msg: any) => {
    const { customer_id } = JSON.parse(msg.content.toString());
    try{
      await visitService.create({customer_id});
    }catch(err){
      console.log(err);
    }
    channel.ack(msg);
  });

  console.log('✅ Consumers started');
}

export default startConsumer
