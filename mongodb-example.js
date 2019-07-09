// npm i mongoose
const UserSchema = require('./src/db/strategies/mongodb/schemas/userSchema')
const MongoDb = require('./src/db/strategies/mongodb/mongoDbStrategy')
const Context = require('./src/db/strategies/base/contextStrategy')

const connection = MongoDb.connect()
contextUser = new Context(new MongoDb(connection, UserSchema))

async function main() {
  const { name, password, balance, account } = await contextUser.create({
    name: 'Batman',
    password: '908762',
    account: 100003,
    balance: 100000
  })
  console.log('result', name, password, balance, account)
}
main()