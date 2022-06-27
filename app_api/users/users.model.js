const { Schema, default: mongoose } = require('mongoose')

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  role: { type: String, default: 'User' },
}, { timestamps: true })

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.passwordHash;
  }
})

module.exports = mongoose.model('User', schema)

