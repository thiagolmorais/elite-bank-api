const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
class UserRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

   listPassword() {
        return {
            path: '/user/password',
            method: 'POST',
            config:{
            },            
            handler: (request, headers) => {
                const teste = this.db.read({name: request.payload.name});
                return teste;
            }
        }
    }

    list() {
        return {
            path: '/user',
            method: 'GET',
            config:{
            },            
            handler: (request, headers) => {
                return this.db.read()
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
                const payload = request.payload
                return this.db.create(payload)
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
                        account: Joi.string().min(5).max(5).required()
                    }
                },

            },
            handler: (request, headers) => {
                const payload = request.payload;
                const account = request.params.account;
                return this.db.update(account, payload)
            }
        }
    }
    // delete() {
    //     return {
    //         path: '/user/{id}',
    //         method: 'DELETE',
    //         config: {
    //             validate: {
    //                 failAction: (request, h, err) => {
    //                     throw err;
    //                 },
    //                 params: {
    //                     id: Joi.string().required()
    //                 }
    //             }
    //         },
    //         handler: (request, headers) => {
    //             const id = request.params.id;
    //             return this.db.delete(id)
    //         }
    //     }
    // }

}

module.exports = UserRoutes