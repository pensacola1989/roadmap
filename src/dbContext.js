import Knex from 'knex';
import BookShelf from 'bookshelf';

let _knex = Knex({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'roadmap',
    charset  : 'utf8'
  }
});
export var knex = _knex;
export var bookshelf = BookShelf(_knex);


