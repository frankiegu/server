
const clear = () =>
  Promise.all([
    pg('account').del(),
    pg('smtp').del(),
    pg('nextcloud').del()
  ])


const acquireDBConnection = () =>  {
  const pg = require('knex')({
    client: 'pg',
    connection: "postgres://postgres:postgres@localhost:5432/joyreaddb"
  });

  return { 
    close: () => pg.destroy(),
    clear: () => 
      Promise.all([
        pg('account').del(),
        pg('smtp').del(),
        pg('nextcloud').del()
      ])
  }
}

module.exports = { acquireDBConnection }
