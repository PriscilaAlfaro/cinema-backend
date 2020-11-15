/* eslint-disable no-console */
const mongoose = require('mongoose');

after(async () => {
  await mongoose.connection.close();
  console.log('mongo connection closed!');
});
