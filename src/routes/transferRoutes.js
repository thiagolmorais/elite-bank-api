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
                        password: Joi.array().required(),
                        userToken: Joi.string().required(),
                    }
                },

            },
            handler: async (request, headers) => {
                const accountOrigin = await this.UserDB.read({account: request.payload.origin})

                if(accountOrigin.length == 0){
                    return ({ 
                        response: false,
                        message: 'Conta de origem não encontrada'
                    })
                }

                const accountDestination = await this.UserDB.read({account: request.payload.destination})
                
                if(accountDestination.length == 0){

                    return ({
                        response: false,
                        message: 'Conta de destino não encontrada'
                    })
                }

                const passwordFront = request.payload.password;                
                const passwordMongo = accountOrigin[0].password                               
                const passwordArray = passwordMongo.split('') 
                            
                let auth = await passwordArray.every((v, k) => {
                    return passwordFront[k].includes(parseInt(v))
                })  

                if(!auth) {
                    return ({
                        response: false,
                        message: 'Senha incorreta!'
                    })
                }

                if(request.payload.userToken != accountOrigin[0].usertoken) {
                    return ({
                        response: false,
                        message: 'Token incorreto!'
                    })
                }

                if (request.payload.value > accountOrigin[0].balance) {
                    return ({
                        response: false,
                        message: 'Saldo Insuficiente'
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
                    response: true,
                    message: 'Transferência realizada com sucesso'
                })
                
            }
        }
    }
    userdata() {
        return {
            path: '/accounts/{account}/transfers',
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
                 let destination = await this.TransferDB.read( { destination: parseInt(request.params.account) })
                 let origin = await this.TransferDB.read( { origin: parseInt(request.params.account) })
                 let transfers = origin.concat(destination)
                 return transfers.sort()
            }
        }
    }

}

module.exports = TransferRoutes