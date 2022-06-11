const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

mongoose.Promise = global.Promise;

module.exports = {
  User: require('../users/users.model'),
  RefreshToken: require('../users/refresh-token.model'),
  isValidId
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}