import startConsumer from './consumer/consumer';
import dbInit from './core/db/init';
require('dotenv').config();

import app from './api/app';
import generateDummyData from './core/db/dummyData';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  dbInit();
  generateDummyData();
  startConsumer().catch(err => console.log(err));
});
