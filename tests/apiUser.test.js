const assert = require('assert')
const api = require('./../api')
let app = {}
let MOCK_ACCOUNT = ""


function cadastrar() {
    return app.inject({
        method: 'POST',
        url: '/user',
        payload: {
            name: 'Joao',
            password: '102030',
            email: 'joa2@email.com',
            balance: 3000,
            account: 10008
        }
    });
}

describe('API User test suite', function ()  {
    this.beforeAll(async () => {
        app = await api()
        
        const result = await cadastrar()
        
        // MOCK_ACCOUNT = JSON.parse(result.payload).account
    })

    // it('listar /user', async () => {
    //     const result = await app.inject({
    //         method: 'GET',
    //         url: '/user'
    //     })
    //     const statusCode = result.statusCode 
        
    //     assert.deepEqual(statusCode, 200)
    //     assert.ok(Array.isArray(JSON.parse(result.payload)))
    // })

    // it('cadastrar /user', async () => {
    //     const result = await cadastrar()
    //     assert.deepEqual(result.statusCode, 200)
    //     assert.deepEqual(JSON.parse(result.payload).name, "Joao")

    // })

    // it('não deve cadastrar com payload errado', async () => {
    //     const result = await app.inject({
    //         method: 'POST',
    //         url: '/user',
    //         payload: {
    //             NOME: 'Jose'
    //         }
    //     })
    //     const payload = JSON.parse(result.payload)
    //     assert.deepEqual(result.statusCode, 400)
    //     assert.ok(payload.message.search('"name" is required') !== -1)
    // })
    // it('atualizar /user/{account}', async () => {
    //     const result = await app.inject({
    //         method: 'PATCH',
    //         url: `/user/${MOCK_ACCOUNT}`,
    //         payload: {
    //             balance: 100000,
    //         }
    //     })
    //     assert.deepEqual(result.statusCode, 200) 
    //     assert.deepEqual(JSON.parse(result.payload).nModified, 1)

    // })
    it('recuperar saldo /balance/{account}', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/balance/10001`,
        })
        console.log(result.payload)
        assert.deepEqual(result.statusCode, 200) 
        assert.deepEqual(JSON.parse(result.payload)[0].balance, 10000)

    })
})

