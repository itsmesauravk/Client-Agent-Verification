const mongoose = require('mongoose');


const RequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
    },
    data: [{
        age: {
          type: Number,
          required: true,
        },
        favoriteFilm: {
          type: String,
          required: true,
        },
      }]
    ,
    status: {
        type: String,
        default: 'Pending'
    }
},
{timestamps: true}
)

module.exports = mongoose.model('Verification', RequestSchema);