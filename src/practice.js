require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

console.log('knex and driver installed correctly');

const q1 = knexInstance('amazong_products').select('*').toQuery();
const q2 = knexInstance.from('amazong_products').select('*').toQuery();

console.log('q1:', q1);

console.log('q2:', q2);

const qry = knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'Point of view gun' })
  .first()
  .toQuery();
  // .then(result => {
  //   console.log(result)
  // });

console.log(qry);

const searchTerm = 'holo'

knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where('name', 'ILIKE', `%${searchTerm}%`)
  .then(result => {
    console.log(result)
  })