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
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    usertoken: {
        type: String,
        required: false
    },
    tokentime:{
        type:Date,
        required: false
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }

})

//mocha workaround
module.exports = Mongoose.models.user || Mongoose.model('user', userSchema)