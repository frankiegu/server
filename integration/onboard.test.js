const { acquireDBConnection } = require('./db-utils.js')
const { startServer } = require('./server.js')
const client = require('./client.js')

let server = { kill: () => {} } ;
let db;

beforeAll(async () => {
  //server = await startServer();
  db = acquireDBConnection();
})

afterAll(async () => {
  await db.clear()
  db.close();
  server.kill();
})

describe('POST /signup', () => {
  it('inserts new users', async () => {
    const res = await client.signUp({ 
      username: 'tester', 
      email: 'tester@somewhere.com', 
      password: 'mypass' 
    })

    console.log(res.status, res.text)
  })
})

