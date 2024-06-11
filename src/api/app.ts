const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
import cors from 'cors';

import customerRoutes from './routes/Customer.routes';
import orderRoutes from './routes/Order.routes';
import visitRoutes from './routes/Visit.routes';
import audienceRoutes from './routes/Audience.routes';
import authRoutes from './routes/Auth.routes';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/audiences', audienceRoutes);
app.use('/api/visits', visitRoutes);

export default app