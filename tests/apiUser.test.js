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
            account: 10008,
            token: ''
        }
    });
}

const MOCK_USER_LISTAR = {
    name: 'Eik',
    account: 100002,
};

let MOCK_USER_LISTAR_TOKEN = ''
let MOCK_USER_LISTAR_ACCOUNT = MOCK_USER_LISTAR.account


describe('API User test suite', function ()  {
    this.timeout(10000);
    this.beforeAll(async () => {
        app = await api()
        const result = await app.inject({
                    method: 'GET',
                    url: `/user/${MOCK_USER_LISTAR.account}`
                })

        MOCK_USER_LISTAR_TOKEN = JSON.parse(result.payload)[0].usertoken
        //const result = await cadastrar()
        
        // MOCK_ACCOUNT = JSON.parse(result.payload).account
    })

    // it('listar /user', async () => {
    //     const result = await app.inject({
    //         method: 'GET',
    //         url: '/user'
    //     })
    //     const statusCode = result.statusCode 
    //     console.log(result.payload)
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
    //         url: `/user/100001`,
    //         payload: {
    //             account: 100001,
    //         }
    //     })
    //     assert.deepEqual(result.statusCode, 200) 
    //     assert.deepEqual(JSON.parse(result.payload).nModified, 1)

    // })
    // it('recuperar saldo /balance/{account}', async () => {
    //     const result = await app.inject({
    //         method: 'GET',
    //         url: `/balance/10001`,
    //     })
    //     console.log(result.payload)
    //     assert.deepEqual(result.statusCode, 200) 
    //     assert.deepEqual(JSON.parse(result.payload)[0].balance, 10000)

    // })
    // it('recuperar dados /account/{account}', async () => {
    //     const result = await app.inject({
    //         method: 'GET',
    //         url: `/accounts/10001`,
    //     })
    //     console.log(result.payload)
    //     assert.deepEqual(result.statusCode, 200) 

    // })
    it('login ou sessão já ativa /login', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                account: 100002,
                password: [[4,2],[5,0],[4,2],[5,0],[4,2],[5,0]]
            }
        })
        
        assert.deepEqual(result.statusCode, 200)   
        assert.deepEqual(JSON.parse(result.payload).response, false)     
    })
    // it('usuario incorreto /login', async () => {
    //     const result = await app.inject({
    //         method: 'POST',
    //         url: '/login',
    //         payload: {
    //             account: 100009,
    //             password: [[4,2],[5,0],[4,2],[5,0],[4,2],[5,0]]
    //         }
    //     })
    //     assert.deepEqual(result.statusCode, 200)
    //     assert.deepEqual(JSON.parse(result.payload).response, false)        
    // })
    // it('senha incorreta /login', async () => {
    //     const result = await app.inject({
    //         method: 'POST',
    //         url: '/login',
    //         payload: {
    //             account: 100002,
    //             password: [[4,2],[5,0],[4,2],[5,0],[4,2],[5,1]]
    //         }
    //     })
    //     assert.deepEqual(result.statusCode, 200) 
    //     assert.deepEqual(JSON.parse(result.payload).response, false)        
    // })
    it('sessão valida /checktoken', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/checktoken',
            payload: {
                account: MOCK_USER_LISTAR_ACCOUNT,
                token: MOCK_USER_LISTAR_TOKEN
            }
        })
        console.log(result.payload)
        assert.deepEqual(result.statusCode, 200)   
        assert.deepEqual(JSON.parse(result.payload).response, true)     
    })
    // it('sessão invalida user incorreto /checktoken', async () => {
    //     const result = await app.inject({
    //         method: 'POST',
    //         url: '/checktoken',
    //         payload: {
    //             account: 100009,
    //             token: '352efe12-6c55-4c58-869c-e8b1c58b8c8c'
    //         }
    //     })
    //     assert.deepEqual(result.statusCode, 200)   
    //     assert.deepEqual(JSON.parse(result.payload).response, false)     
    // })
    // it('sessão invalida token incorreto /checktoken', async () => {
    //     const result = await app.inject({
    //         method: 'POST',
    //         url: '/checktoken',
    //         payload: {
    //             account: 100009,
    //             token: '352efe12-6c55-4c58-869c-e8b1c58bc8c'
    //         }
    //     })
    //     assert.deepEqual(result.statusCode, 200)   
    //     assert.deepEqual(JSON.parse(result.payload).response, false)     
    // })
    // it('logout com sucesso /logout', async () => {
    //     const result = await app.inject({
    //         method: 'POST',
    //         url: '/logout',
    //         payload: {
    //             account: MOCK_USER_LISTAR_ACCOUNT,
    //             token: MOCK_USER_LISTAR_TOKEN
    //         }
    //     })
    //     assert.deepEqual(result.statusCode, 200)   
    //     assert.deepEqual(JSON.parse(result.payload).response, true)     
    // })
    
})

