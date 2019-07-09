const Hapi = require('hapi')
const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDB = require('./src/db/strategies/mongodb/mongoDbStrategy')
const UserSchema = require('./src/db/strategies/mongodb/schemas/userSchema')
const UserRoutes = require('./src/routes/userRoutes')

const app = new Hapi.Server({
    port: 4000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {

    const connection = MongoDB.connect()
    const mongoDb = new Context(new MongoDB(connection, UserSchema))


    app.route([
        ...mapRoutes(new UserRoutes(mongoDb), UserRoutes.methods())
    ])

    await app.start()
    console.log('server running at', app.info.port)

    await app.inject({
        method: 'POST',
        url: '/user',
        payload: {
            name: 'joao',
            password: '102030',
            email: 'joao@email.com',
            balance: 10000,
            account: 10001
        }
    })
    await app.inject({
        method: 'POST',
        url: '/user',
        payload: {
            name: 'jose',
            password: '102030',
            email: 'jose@email.com',
            balance: 10000,
            account: 10002
        }
    })
    return app;
}
module.exports = main()