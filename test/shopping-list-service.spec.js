const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const { getById } = require('../src/shopping-list-service');

describe(`Shopping list service object`, function() {
  let db

  let testList = [
    {
      id: 1,
      name: 'First item',
      price: '1.00',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      category: 'Main',
    },
    {
      id: 2,
      name: 'Second item',
      price: '3.00',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: true,
      category: 'Breakfast',
    },
    {
      id: 3,
      name: 'Third item',
      price: '5.00',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: false,
      category: 'Lunch',
    },
    {
      id: 4,
      name: 'Second item',
      price: '17.00',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: false,
      category: 'Snack',
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.DB_URL,
    });
  });

  before(() => db('shopping_list').truncate());

  afterEach(() => db('shopping_list').truncate());

  after(() => db.destroy())

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testList)
      ;
    });

    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testList);
        });
    });

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdTestItem = testList[thirdId - 1]
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdTestItem.name,
            price: thirdTestItem.price,
            date_added: thirdTestItem.date_added,
            category: thirdTestItem.category,
            checked: thirdTestItem.checked,
          });
        })
      ;
    });

    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: 'Updated item',
        price: '9.00',
        date_added: new Date('2100-05-22T16:28:32.615Z'),
        checked: false,
        category: 'Snack',
      }
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData,
          });
        })
      ;
    })

    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3
        return ShoppingListService.deleteItem(db, itemId)
          .then(() => ShoppingListService.getAllItems(db))
          .then(allItems => {
            // copy the test articles array without the "deleted" article
            const expected = testList.filter(item => item.id !== itemId);
            expect(allItems).to.eql(expected);
          })
        ;
      });
    });

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        })
      ;
    });

    it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
      const newItem = {
        name: 'Inserted item',
        price: '9.00',
        date_added: new Date('2100-05-22T16:28:32.615Z'),
        checked: false,
        category: 'Snack',
      }
      return ShoppingListService.insertItem(db, newItem)
      .then(actual => {
        expect(actual).to.eql({
          id: 1,
          name: newItem.name,
          price: newItem.price,
          date_added: newItem.date_added,
          checked: newItem.checked,
          category: newItem.category,
        });
      });
    });
  });
});