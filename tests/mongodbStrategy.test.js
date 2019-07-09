const assert = require('assert')
const MongoDb = require('./../src/db/strategies/mongodb/mongoDbStrategy')
const UserSchema = require('./../src/db/strategies/mongodb/schemas/userSchema')
const TransferSchema = require('./../src/db/strategies/mongodb/schemas/transferSchema')
const Context = require('./../src/db/strategies/base/contextStrategy')

// 1o alterar criar pasta mongodb
// 2o mover mongodbStrategy para mongodb
// 3o modificar classe do mongodbStrategy
// 4o modificar criar schema em mongodb/schemas
// 6o modificar teste fazendo conexão direto do MongoDB
// 5o modificar teste passando para o MongoDB

const MOCK_USER_CADASTRAR = {
    name: 'Warren',
    password: '101010',
    account: 00001,
    balance: 1000000,
    email: 'joao@email.com'
};

const MOCK_USER_LISTAR = {
    name: 'Warren',
    account: 00001,
    balance: 1000000
};

const MOCK_USER_ATUALIZAR = {
    name: 'Eik',
    password: '202020',
    account: 00002,
    balance: 5000,
    email: 'email@email.com'
};
let MOCK_USER_ATUALIZAR_ACCOUNT = '';
let contextUser = {}
let contextTransfer = {}

describe('MongoDB Suite de testes', function () {
    this.beforeAll(async () => {
        const connection = MongoDb.connect()
        contextUser = new Context(new MongoDb(connection, UserSchema))
        contextTransfer = new Context( new MongoDb(connection, TransferSchema))

        const result = await contextUser.create(MOCK_USER_ATUALIZAR)
        MOCK_USER_ATUALIZAR_ACCOUNT = result.account
    })
    it('verificar conexao', async () => {
        const result = await contextUser.isConnected()
        const expected = 'Conectado'

        assert.deepEqual(result, expected)
    })
    it('cadastrar', async () => {
        const { name, password, balance, account, email} = await contextUser.create(MOCK_USER_CADASTRAR)
        
        assert.deepEqual({ name, password, balance, account, email }, MOCK_USER_CADASTRAR)
    })

    it('listar', async () => {
        const [{ name, balance, account}] = await contextUser.read({ name: MOCK_USER_CADASTRAR.name})
        const result = {
            name, balance, account
        }
        assert.deepEqual(result, MOCK_USER_LISTAR)
    })
    it('atualizar', async () => {
        const result = await contextUser.update(MOCK_USER_ATUALIZAR_ACCOUNT, {
            balance: '5555'
        })
        assert.deepEqual(result.nModified, 1)
    })
    it('remover', async () => {
        const result = await contextUser.delete(MOCK_USER_ATUALIZAR_ACCOUNT)
        assert.deepEqual(result.n, 1)
    })
})