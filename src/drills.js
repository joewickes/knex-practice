require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchTerm(string) {
  knexInstance
    .select('id', 'name', 'price')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${string}%`)
    .then((res) => console.log(res))
  ;
} 

searchTerm('o');

function pageNumber(number) {
  const productsPerPage = 6;
  const offset = productsPerPage * (number - 1)
  knexInstance
    .select('id', 'name', 'price')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(res => {
      console.log(res)
    })
}

pageNumber(2);

function daysAgo(number) {
  knexInstance
    .select('id', 'name', 'price')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, number)
    )
    .then(res => {
      console.log(res);
    })
  ;
}

daysAgo(2);

function categoryCosts() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then(res => {
      console.log(res)
    })
}

categoryCosts();