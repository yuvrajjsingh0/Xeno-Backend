import { sequelize } from '../utils/utils'; // Adjust the path according to your project structure
import Customer from './models/Customer';
import Order from './models/Order';
import Visit from './models/Visit';
import { faker } from '@faker-js/faker';

async function generateDummyData() {
  await sequelize.sync({ force: true }); // This will drop and recreate the tables

  const customers = [];
  for (let i = 0; i < 100; i++) {
    const customer = await Customer.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      createdAt: faker.date.past(2), // Up to 2 years ago
      updatedAt: faker.date.past(1), // Up to 1 year ago
    });
    customers.push(customer);
  }

  for (const customer of customers) {
    const ordersCount = faker.number.int({ min: 1, max: 5 });
    for (let j = 0; j < ordersCount; j++) {
      await Order.create({
        customer_id: customer.id,
        product: faker.commerce.product(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        amount: faker.number.int({ min: 100, max: 10000 }),
        createdAt: faker.date.past(1, customer.createdAt), // Orders are after the customer's creation date
        updatedAt: faker.date.past(1), // Random past date
      });
    }

    const visitsCount = faker.number.int({ min: 0, max: 5 });
    for (let k = 0; k < visitsCount; k++) {
      await Visit.create({
        customer_id: customer.id,
        createdAt: faker.date.past(1, customer.createdAt), // Visits are after the customer's creation date
        updatedAt: faker.date.past(1), // Random past date
      });
    }
  }

  console.log('Dummy data generated successfully');
}

export default generateDummyData