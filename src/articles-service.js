const ArticlesService = {
  getAllArticles(knex) {
    return knex.select('*').from('blogful_articles');
  },
  insertArticle(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into('blogful_articles')
      .returning('*')
      .then(rows => {
        return rows[0];
      })
    ;
  },
  getById(knex, id) {
    return knex('blogful_articles')
      .where('id', id).first()
    ;
  },
  updateArticle(knex, id, newItemFields) {
    return knex('blogful_articles')
      .where({ id })
      .update(newItemFields);
  },
  deleteArticle(knex, id) {
    return knex('blogful_articles')
      .where('id', id)
      .delete()
    ;
  },
};

module.exports = ArticlesService;