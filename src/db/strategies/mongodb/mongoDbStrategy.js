const ICrud = require('../base/interfaceDb')
const Mongoose = require('mongoose')
const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando',
}
class MongoDB extends ICrud {
    
     // 1o 
    constructor(connection, schema) {
        super()
        this._connection = connection;
        this._collection = schema;
    }
    // 2o
    async isConnected() {
        const state = STATUS[this._connection.readyState]
        if (state === 'Conectado') return state;

        if (state !== 'Conectando') return state

        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]

    }
    // 3o
    static connect() {
        Mongoose.connect('mongodb://bankadmin:adminbankpwd@localhost:27017/bank', {
            useNewUrlParser: true
        }, function (error) {
            if (!error) return;
            console.log('Falha na conexão!', error)
        })
        const connection = Mongoose.connection
        connection.once('open', () => console.log('database rodando!!'))
        return connection;
    }

    async create(item) {
        return this._collection.create(item)
    }
    async read(item = {}) {
        return this._collection.find(item, { name: 1, balance: 1, account: 1})
    }
    async update(account, item) {
        return this._collection.updateOne({account}, { $set: item})
    }    
    async delete(account) {
        return this._collection.deleteOne({account})
    }
}

module.exports = MongoDB