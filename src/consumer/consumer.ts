import amqp from 'amqplib';
require('dotenv').config();

import * as customerService from '../core/services/Customer.service'
import * as orderService from '../core/services/Order.service'
import * as visitService from '../core/services/Visit.service'
import * as audienceService from '../core/services/Audience.service'
import * as communicationLogService from '../core/services/CommunicationLog.service'
import { CustomerOutput } from '../core/db/models/Customer';

async function startConsumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('communicationMessageQueue');

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

  channel.consume('audienceQueue', async (msg: any) => {
    let { title, numUsers, rules } = JSON.parse(msg.content.toString());
    try{
      if(typeof rules != 'string') rules = JSON.stringify(rules);
      if(typeof numUsers != 'number') numUsers = Number(numUsers);
      await audienceService.create({ title, numUsers, rules, isCompleted: false });
    }catch(err){
      console.log(err);
    }
    channel.ack(msg);
  });

  channel.consume('communicationQueue', async (msg: any) => {
    const { audienceId } = JSON.parse(msg.content.toString());
    try{
      const audience = await audienceService.getById(audienceId);
      customerService.getCustomersByRules(JSON.parse(audience.rules))
      .then((customers: CustomerOutput[]) => {
        for(const customer of customers){
          // Send message to each customer according to campaign
          const rand = Math.random();
          channel.sendToQueue("communicationMessageQueue", Buffer.from(JSON.stringify({ customer_id: customer, audience_id: audienceId, status: rand < 0.9 ? "SENT" : "FAILED" })))
        }
        return;
      }).then(() => {
        audienceService.update(audienceId, {isCompleted: true});
      }).catch(err => {
        console.log("Audience ID:", audienceId, "Could not send to user", err);
      });
    }catch(err){
      console.log("Audience Not Found with ID", audienceId);
    }
    channel.ack(msg);
  });

  channel.consume('communicationMessageQueue', async (msg: any) => {
    const { customer_id, audience_id, status } = JSON.parse(msg.content.toString());
    try{
      await communicationLogService.create({ customer_id, audience_id, status });
    }catch(err){
      console.log(err);
    }
    channel.ack(msg);
  });

  console.log('✅ Consumers started');
}

export default startConsumer
