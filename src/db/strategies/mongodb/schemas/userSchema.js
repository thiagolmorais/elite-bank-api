const Mongoose=  require('mongoose')
const userSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    account: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },    
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

//mocha workaround
module.exports = Mongoose.models.user || Mongoose.model('user', userSchema)