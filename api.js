const Hapi = require('hapi')
const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDB = require('./src/db/strategies/mongodb/mongoDbStrategy')
const UserRoutes = require('./src/routes/userRoutes')
const TransferRoutes = require('./src/routes/transferRoutes')
const UserSchema = require('./src/db/strategies/mongodb/schemas/userSchema')
const TransferSchema = require('./src/db/strategies/mongodb/schemas/transferSchema')

const app = new Hapi.Server({
    port: process.env.PORT || 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {

    const connection = MongoDB.connect()
    const mongoDbUser = new Context(new MongoDB(connection, UserSchema))
    const mongoDbTransfer = new Context(new MongoDB(connection, TransferSchema))
    
    app.route([
        ...mapRoutes(new UserRoutes(mongoDbUser), UserRoutes.methods()),
        ...mapRoutes(new TransferRoutes(mongoDbTransfer, mongoDbUser), TransferRoutes.methods()),
    ])

    await app.start()
    console.log('server running at', app.info.port)

    // await app.inject({
    //     method: 'POST',
    //     url: '/user',
    //     payload: {
    //         name: 'joao',
    //         password: '102030',
    //         email: 'joao@email.com',
    //         balance: 10000,
    //         account: 10001
    //     }
    // })
    // await app.inject({
    //     method: 'POST',
    //     url: '/user',
    //     payload: {
    //         name: 'jose',
    //         password: '102030',
    //         email: 'jose@email.com',
    //         balance: 10000,
    //         account: 10002
    //     }
    // })
    return app;
}

main();