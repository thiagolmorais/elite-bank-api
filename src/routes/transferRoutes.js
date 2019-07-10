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
                
            },
            handler: (request, headers) => {
                return this.db.read()
            }
        }
    }
    create() {
        return {
            path: '/transfer',
            method: 'POST',
            config: {

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
                const payload = request.payload
                return this.db.create(payload)
            }
        }
    }

}

module.exports = TransferRoutes