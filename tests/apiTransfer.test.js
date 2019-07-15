const assert = require('assert')
const api = require('./../api')
let app = {}
let MOCK_ACCOUNT = ""


function cadastrar() {
    return app.inject({
        method: 'POST',
        url: '/transfer',
        payload: {
            origin: 100002,
            destination: 100001,
            value: 100,
            userToken: '9f127278-8670-464a-9328-8120f5092dc2'
        }
    });
}

describe.only('API Transfer test suite', function ()  {
    this.timeout(100000)
    this.beforeAll(async () => {
        app = await api()
        //const result = await cadastrar()
        
        // MOCK_ACCOUNT = JSON.parse(result.payload).account
    })
    it('cadastrar /transfer', async () => {
        const result = await cadastrar()
        console.log(result.payload)
        assert.deepEqual(result.statusCode, 200)
        // assert.deepEqual(JSON.parse(result.payload).name, "Joao")
     })
    //  it('recebe transferencias /accounts/{account}/transfers', async () => {
    //     const result = await app.inject({
    //                 method: 'GET',
    //                 url: '/accounts/100002/transfers/b34d1bde-a92f-403d-9dd8-2e1e74f9f865'
    //             })
    //     assert.deepEqual(result.statusCode, 200)
    //     // assert.deepEqual(JSON.parse(result.payload).name, "Joao")

    //  })
})

