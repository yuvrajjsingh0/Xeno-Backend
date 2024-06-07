import Customer from './models/Customer'
import Order from './models/Order'
import Visit from './models/Visit'
const isDev = process.env.NODE_ENV === 'development'

const dbInit = () => {
    Customer.sync({ alter: isDev });
    Order.sync({alter: isDev});
    Visit.sync({alter: isDev})
}
export default dbInit