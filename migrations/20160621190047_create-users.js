
exports.up = function(knex, Promise) {
  console.log('Creating Users')
  return knex.schema.createTableIfNotExists('Users', function (table) {
    table.increments('id').primary();
    table.string('userName').notNullable();
    table.string('mobile').notNullable();
    table.string('company').notNullable();
   	table.string('duty').notNullable();
   	table.string('openid').notNullable();
   	table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  console.log('Dropping Users')
  return knex.schema.dropTableIfExists('Users').then(function () {
    console.log('Users table was dropped')
  });
};
