import Customer from './models/Customer'
import Order from './models/Order'
import Visit from './models/Visit'
import Audience from './models/Audience'
import CommunicationLog from './models/CommunicationLog'
const isDev = process.env.NODE_ENV === 'development'

const dbInit = async () => {
    // Audience.sync({alter: true});
    // CommunicationLog.sync({alter: true});
    
    Customer.hasMany(Order, { foreignKey: 'customer_id' });
    Customer.hasMany(Visit, { foreignKey: 'customer_id' });
    Customer.hasMany(CommunicationLog, { foreignKey: 'customer_id' });
    CommunicationLog.belongsTo(Customer, {foreignKey: 'customer_id', targetKey: 'id'});
    
}
export default dbInit