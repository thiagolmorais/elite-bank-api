const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
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
                tags: ['api'],
                description: 'Login',
                notes: 'Retorna verdadeiro se os dados estiverem corretos',
                validate:{
                    failAction: (r, h, erro) => {
                        throw erro
                    },
                    payload: {
                        account: Joi.number(),
                        password: Joi.array()                        
                    }                    
                }
            },            
            handler: async (request, headers) => {
                try {                
                    const account = await this.db.read({account: request.payload.account});               
                    const passwordFront = request.payload.password;                
                    const passwordMongo = account[0].password                               
                    const passwordArray = passwordMongo.split('')                
                    let auth = await passwordArray.every((v, k) => {
                        return passwordFront[k].includes(parseInt(v))
                    })                
                    return auth;
                } catch(error) {
                    return Boom.internal();
                }              
            }
        }
    }

    list() {
        return {
            path: '/user',
            method: 'GET',
            config:{
                tags: ['api'],
                description: 'Listar usuários',
                notes: 'Pode filtar por nome e paginar',
                validate: {

                }
            },            
            handler: (request, headers) => {
                try { 
                    return this.db.read() 
                } catch(error) {
                    return Boom.internal();
                }               
            }
        }
    }
    create() {
        return {
            path: '/user',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cria usuários',
                notes: 'Serve para criar usuário',
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
                try {
                    const payload = request.payload
                    return this.db.create(payload)
                } catch(error) {
                    return Boom.internal();
                }
            }
        }
    }
    update() {
        return {
            path: '/user/{account}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Altera usuários',
                notes: 'Serve para alterar as informações do usuário',
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
                try {
                    const payload = request.payload;
                    const account = request.params.account;                
                    return this.db.update(account, payload)
                } catch(error) {
                    return Boom.internal();
                }
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
