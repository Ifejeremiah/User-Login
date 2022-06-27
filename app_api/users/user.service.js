const bcrypt = require('bcrypt')
const db = require('../_config/db')

module.exports = {
  getAll,
  getUserById,
  saveUser
}

async function getAll() {
  const users = await db.User.find()
  return users.map(x => format(x))
}

async function getUserById(id) {
  const user = await db.User.findById(id)
  return format(user)
}

async function saveUser({ firstName, lastName, email, password }) {
  console.log(firstName, lastName, email, password )
  return db.User.create({
    firstName,
    lastName,
    email,
    passwordHash: password ? bcrypt.hashSync(password, 12) : ''
  });
}

// helper functions
function format(body) {
  const { id, firstName, lastName, email, role } = body
  return { id, firstName, lastName, email, role }
}