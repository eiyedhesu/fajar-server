const mongoose = require ('mongoose')
// const {dbHost, dbPass, dbName, dbPort, dbUser} = require('../app/config')

// mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`)
mongoose.connect(`mongodb://127.0.0.1:27017/fajarstore`)
const db = mongoose.connection
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected...'));
module.exports = db