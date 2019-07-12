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
            handler: async (request, headers) => {
                const accountOrigin = await this.UserDB.read({account: request.payload.origin})
                
                if(!accountOrigin){
                    return ({ 
                        response: 'false',
                        message: 'Conta de origem não encontrada'
                    })
                }
                const accountDestination = await this.UserDB.read({account: request.payload.destination})
                
                if(!accountDestination){

                    return ({
                        response: 'false',
                        message: 'Conta de destino não encontrada'
                    })
                }

                let originBalance = parseInt(accountOrigin[0].balance) - parseInt(request.payload.value)                
                let destinationBalance = parseInt(accountDestination[0].balance) + parseInt(request.payload.value)
                
                await this.UserDB.update(request.payload.origin, {balance: originBalance.toString()})
                
                await this.UserDB.update(request.payload.destination, {balance: destinationBalance.toString()})

                const payload = request.payload
                payload.preOriginBalance = accountOrigin[0].balance
                payload.preDestinationBalance = accountDestination[0].balance
                
                await this.TransferDB.create(payload)

                return ({
                    response: 'true',
                    message: 'Transferência realizada com sucesso'
                })
                
            }
        }
    }

}

module.exports = TransferRoutes