const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const uuid = require('uuid/v4')
class UserRoutes extends BaseRoute {
    constructor(userDb) {
        super()
        this.UserDb = userDb
    }

    listPassword() {
        return {
            path: '/login',
            method: 'POST',
            config:{
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                      },
                    payload: {
                        account: Joi.number().required(),
                        password: Joi.array().required(),
                    }
                },
            },            
            handler: async (request, headers) => {
                
                const account = await this.UserDb.read({account: request.payload.account});
                
                if(account.length == 0){
                    return {
                        response: false,
                        message: 'Usuário ou senha incorreto!'
                    }
                }     

                const passwordFront = request.payload.password;                
                const passwordMongo = account[0].password                               
                const passwordArray = passwordMongo.split('') 
                            
                let auth = await passwordArray.every((v, k) => {
                    return passwordFront[k].includes(parseInt(v))
                })  

                if(!auth) {
                    return ({
                        response: false,
                        message: 'Usuário ou senha incorreto!'
                    })
                }

                if(!account[0].usertoken) {
                    const userToken = uuid()
                    const userData = {
                        account: account[0].account,
                        name: account[0].name,
                        balance: account[0].balance,
                        userToken                        
                    }

                    await this.UserDb.update(account[0].account, {usertoken: userToken, tokentime: Date.now()})
                    return {
                        response: true,
                        message: userData
                    }
                }

                const diff = Math.abs((account[0].tokentime - Date.now())/(1000 * 60))
                if(diff < 15) {
                    return {
                        response: false,
                        message: 'Usuário já tem uma sessão ativa!'
                    }
                }

                const userToken = uuid()

                const userData = {
                    account: account[0].account,
                    name: account[0].name,
                    balance: account[0].balance,
                    userToken
                }
                await this.UserDb.update(account[0].account, {usertoken: userToken, tokentime: Date.now()})
                return {
                    response: true,
                    message: userData
                }
            }
        }
    }

    logout() {
        return {
            path: '/logout',
            method: 'POST',
            config:{
                tags:['api'],
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                      },
                    payload: {
                        account: Joi.number().required(),
                        token: Joi.string().required(),
                    }
                },
            },            
            handler: async (request, headers) => {
                const account = await this.UserDb.read({account: request.payload.account},1)

                if(account.length == 0){
                    return {
                        response: false,
                        message: 'Usuário ou token incorreto!'
                    }
                }
                
                if(account[0].usertoken !== request.payload.token) {
                    return {
                        response: false,
                        message: 'Usuário ou token incorreto!'
                    }
                }

                this.UserDb.update(request.payload.account, {usertoken:''})
                return {
                    response: true,
                    message: 'Usuário deslogado'
                }
                
            }
        }
    }

    checkToken() {
        return {
            path: '/checktoken',
            method: 'POST',
            config:{
                tags:['api'],
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                      },
                    payload: {
                        account: Joi.number().required(),
                        token: Joi.string().required(),
                    }
                },
            },            
            handler: async (request, headers) => {

                const account = await this.UserDb.read({account: request.payload.account},1)
                if(account.length == 0){
                    return {
                        response: false,
                        message: 'Usuário ou token incorreto!'
                    }
                }
                
                if(account[0].usertoken !== request.payload.token) {
                    return {
                        response: false,
                        message: 'Usuário ou token incorreto!'
                    }
                }

                const diff = Math.abs((account[0].tokentime - Date.now())/(1000 * 60))
                if(diff < 15) {
                    await this.UserDb.update(account[0].account, {tokentime: Date.now()})
                    const userData = {
                        account: account[0].account,
                        name: account[0].name,
                        balance: account[0].balance,
                        userToken: account[0].usertoken
                    }

                    return {
                        response: true,
                        message: userData
                    }
                }

                this.userDb.update(request.payload.account, {usertoken:''})
                return
                
            }
        }
    }

    list() {
        return {
            path: '/user',
            method: 'GET',
            config:{
                tags:['api'],
                validate: {

                }
            },            
            handler: (request, headers) => {

                return this.UserDb.read()
            }
        }
    }

    listOne() {
        return {
            path: '/user/{account}',
            method: 'GET',
            config:{
                tags:['api'],
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                      },
                      params: {
                        account: Joi.string().required()
                    }
                },
            },            
            handler: (request, headers) => {

                return this.UserDb.read({account: request.params.account})
            }
        }
    }

    create() {
        return {
            path: '/user',
            method: 'POST',
            config: {

                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                      },
                    payload: {
                        name: Joi.string().max(100).required(),
                        password: Joi.number().required(),
                        balance: Joi.number(),
                        email: Joi.string().required(),
                        account: Joi.number().required()
                    }
                },

            },
            handler: (request, headers) => {
                //inserir aqui regras de inserção;
                const payload = request.payload
                return this.UserDb.create(payload)
            }
        }
    }

    balance() {
        return {
            path: '/balance/{account}',
            method: 'GET',
            config: {
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                      },
                    params: {
                        account: Joi.string().required()
                    }
                },
            },            
            handler: async (request, headers) => {
                const account = await this.UserDb.read({account: request.params.account},1)

                if(account.length == 0)
                {
                    return {
                        response: false,
                        message: 'Conta não encontrada!'
                    }
                }

                const balance = account[0].balance
                return {
                    response: true,
                    message: balance
                }
            }
        }
    }

    userdata() {
        return {
            path: '/accounts/{account}',
            method: 'GET',
            config: {
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                      },
                    params: {
                        account: Joi.string().required()
                    }
                },
            },            
            handler: async (request, headers) => {
                
                const item = await this.UserDb.read({account: request.params.account},1)

                if(item.length == 0){
                    return {
                        response: false,
                        message: 'Usuário não encontrado'
                    }
                }
                const itemData = {
                    name: item[0].name,
                    account: item[0].account
                }
                return {
                    response: true,
                    message: itemData
                }
            }
        }
    }

    update() {
        return {
            path: '/user/{account}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                      },
                    payload: {
                        balance: Joi.number(),
                    },
                    params: {
                        account: Joi.string().required()
                    }
                },

            },
            handler: (request, headers) => {
                const payload = request.payload;
                const account = request.params.account;
                return this.UserDb.update(account, payload)
            }
        }
    }
}

module.exports = UserRoutes