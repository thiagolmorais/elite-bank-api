const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
class UserRoutes extends BaseRoute {
    constructor(userDb) {
        super()
        this.UserDb = userDb
    }

    list() {
        return {
            path: '/user',
            method: 'GET',
            config:{
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