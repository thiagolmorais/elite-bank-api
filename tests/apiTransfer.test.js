const assert = require('assert')
const api = require('./../api')
let app = {}
let MOCK_ACCOUNT = ""

function cadastrar() {
    return app.inject({
        method: 'POST',
        url: '/transfer',
        payload: {
            origin: 10008,
            destination: 10007,
            value: 100,
        }
    });
}

describe('API User test suite', function ()  {
    this.beforeAll(async () => {
        app = await api
        const result = await cadastrar()
        
        MOCK_ACCOUNT = JSON.parse(result.payload).account
    })

    it('listar /transfer', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/transfer'
        })
        const statusCode = result.statusCode 
        
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(JSON.parse(result.payload)))
    })

    it('cadastrar /transfer', async () => {
        const result = await cadastrar()
        assert.deepEqual(result.statusCode, 200)
        assert.deepEqual(JSON.parse(result.payload).name, "Joao")

    })

    it('não deve cadastrar com payload errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                NOME: 'Jose'
            }
        })
        const payload = JSON.parse(result.payload)
        assert.deepEqual(result.statusCode, 400)
        assert.ok(payload.message.search('"name" is required') !== -1)
    })
    it('atualizar /user/{account}', async () => {
        const result = await app.inject({
            method: 'PATCH',
            url: `/user/${MOCK_ACCOUNT}`,
            payload: {
                balance: 5000,
            }
        })
        assert.deepEqual(result.statusCode, 200) 
        assert.deepEqual(JSON.parse(result.payload).nModified, 1)

    })
    // it('remover /herois/{id}', async () => {
    //     const result =  await app.inject({
    //         method: 'DELETE',
    //         url: `/herois/${MOCK_ID}` 
    //     })
    //     assert.deepEqual(result.statusCode, 200) 
    //     assert.deepEqual(JSON.parse(result.payload).n, 1)
    // })
})

