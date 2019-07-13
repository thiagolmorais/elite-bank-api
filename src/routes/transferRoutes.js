const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
class TransferRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/transfer',
            method: 'GET',
            config:{
                tags: ['api'],
                description: 'Lista as transferências',
                notes: 'Serve para listar as transferências',                
            },
            handler: (request, headers) => {
                try {
                    return this.db.read()
                } catch(error){
                    return Boom.internal();
                }
            }
        }
    }
    create() {
        return {
            path: '/transfer',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cria ...',
                notes: 'Serve para criar ...',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                      },
                    payload: {
                        origin: Joi.number().required(),
                        destination: Joi.number().required(),
                        value: Joi.number().required(),
                    }
                },

            },
            handler: (request, headers) => {
                try {
                    const payload = request.payload
                    return this.db.create(payload)
                } catch(error){
                    return Boom.internal();
                }
            }
        }
    }

}

module.exports = TransferRoutes