const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
class TransferRoutes extends BaseRoute {
    constructor(transferDB, UserDB) {
        super()
        this.TransferDB = transferDB
        this.UserDB = UserDB
    }

    list() {
        return {
            path: '/transfer',
            method: 'GET',
            config:{
                
            },
            handler: (request, headers) => {
                return this.TransferDB.read()
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
                const accountOrigin = this.UserDB.read({account: request.payload.origin})
                if(!accountOrigin){
                    return ({ response: 'Account not found'})
                }
                const accountDestination = this.UserDB.read({account: request.payload.destination})
                if(!accountDestination){

                    return ({response: 'Account not found'})
                }

                let originBalance = accountOrigin.balance - request.payload.value
                let destinationBalance = accountDestination.balance + request.payload.value
                this.UserDB.update({account: request.payload.origin}, {balance: originBalance}) 
                this.UserDB.update({account: request.payload.destination}, {balance: destinationBalance})

                const payload = request.payload
                return this.TransferDB.create(payload)
            }
        }
    }

}

module.exports = TransferRoutes