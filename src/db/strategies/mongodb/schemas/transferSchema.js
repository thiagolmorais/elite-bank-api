const Mongoose=  require('mongoose')
const TransferSchema = new Mongoose.Schema({
    origin: {
        type: Number,
        required: true
    },
    destination: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },    
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

//mocha workaround
module.exports = Mongoose.models.transfer || Mongoose.model('transfer', TransferSchema)