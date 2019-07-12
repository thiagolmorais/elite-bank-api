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
                //console.log(request.payload);
                const account = await this.UserDb.read({account: request.payload.account});               
                const passwordFront = request.payload.password;                
                const passwordMongo = account[0].password                               
                const passwordArray = passwordMongo.split('') 
                            
                let auth = await passwordArray.every((v, k) => {
                    return passwordFront[k].includes(parseInt(v))
                })  

                if(!auth) {
                    return ({
                        response: 'false',
                        message: 'Password incorrect!'
                    })
                }

                // if (account[0].userToken == ''){
                //     console.log('ok')
                // }


                
                // const diff = (account[0].insertedAt - Date.now())/(1000 * 60)

                // console.log('diff', diff)

                const userToken = uuid()

                const userData = {
                    account: account[0].account,
                    name: account[0].name,
                    balance: account[0].balance,
                    userToken
                }
                return userData;
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
            handler: (request, headers) => {
                return this.UserDb.readBalance({account: request.params.account},1)
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
                console.log('item',item)

                if(item.length == 0){
                    return {
                        response: 'false',
                        message: 'Usuário não encontrado'
                    }
                }
                const itemData = {
                    name: item[0].name,
                    account: item[0].account
                }
                return {
                    response: 'true',
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
