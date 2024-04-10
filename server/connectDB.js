const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to the database")
}).catch((err) => {
    console.log("Error connecting to the database", err)
})

module.exports = mongoose;