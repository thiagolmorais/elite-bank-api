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
            password: [[4,2],[5,0],[4,2],[5,0],[4,2],[5,0]],
            userToken: '500a6f20-7a99-44b9-bea5-1261a6309151'
        }
    });
}

describe('API Transfer test suite', function ()  {
    this.timeout(100000)
    this.beforeAll(async () => {
        app = await api()
        //const result = await cadastrar()
        
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

    it('cadastrar /transfer', async () => {
        const result = await cadastrar()
        console.log(result.payload)
        assert.deepEqual(result.statusCode, 200)
        // assert.deepEqual(JSON.parse(result.payload).name, "Joao")

     })
})

