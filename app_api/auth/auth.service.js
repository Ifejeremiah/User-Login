const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { default: axios } = require('axios')
const queryString = require('query-string')

const { saveUser } = require('../users/user.service')
const secret = process.env.AUTH_SECRET
const db = require('../_config/db')

module.exports = {
  authenticate,
  register,
  googleAuth,
  refreshToken,
  getRefreshTokens,
  revokeToken,
  logout
}

async function authenticate({ email, password, ipAddress }) {
  const user = await db.User.findOne({ email })

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw 'Username or password is incorrect'
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, ipAddress);

  await refreshToken.save();

  // return basic details and tokens
  return {
    ...format(user),
    accessToken,
    refreshToken: refreshToken.token
  };
}

async function register({ firstName, lastName, email, password, ipAddress }) {
  const exists = await db.User.findOne({ email })
  if (exists) throw 'Email already has an account'

  const user = await saveUser({ firstName, lastName, email, password })

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user, ipAddress)

  await refreshToken.save();

  // return basic details and tokens
  return {
    ...format(user),
    accessToken,
    refreshToken: refreshToken.token
  };
}

async function googleAuth({ idToken, authToken, ipAddress }) {
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${authToken}`
  const options = { headers: { Authorization: `Bearer ${idToken}` } }

  const { given_name: firstName,
    family_name: lastName,
    email } = await axios.get(url, options)
      .then((res) => res.data)
      .catch(error => { throw error })

  let user = await db.User.findOne({ email })
  let accessToken, refreshToken

  if (user) {
    accessToken = generateAccessToken(user)
    refreshToken = generateRefreshToken(user, ipAddress)
    await refreshToken.save();
  } else {
    user = await saveUser({ firstName, lastName, email })
    accessToken = generateAccessToken(user)
    refreshToken = generateRefreshToken(user, ipAddress)
    await refreshToken.save();
  }

  // return basic details and tokens
  return {
    ...format(user),
    accessToken,
    refreshToken: refreshToken.token
  };
}

function generateAccessToken(user) {
  // create a access token that expires in 1min
  return jwt.sign({ sub: user.id, id: user.id }, secret, { expiresIn: '2m' });
}

function generateRefreshToken(user, ipAddress) {
  // create a refresh token that expires in 7 days
  return new db.RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress
  });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(user, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const accessToken = generateAccessToken(user);

  // return basic details and tokens
  return {
    ...format(user),
    accessToken,
    refreshToken: newRefreshToken.token
  };
}

async function getRefreshToken(token) {
  const refreshToken = await db.RefreshToken.findOne({ token }).populate('user');

  if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
  return refreshToken;
}

async function getRefreshTokens(userId) {
  // check that user exists
  await getUser(userId);

  // return refresh tokens for user
  const refreshTokens = await db.RefreshToken.find({ user: userId });
  return refreshTokens;
}

async function revokeToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
}

async function logout({ token }) {
  const { user } = await getRefreshToken(token);
  await db.RefreshToken.deleteMany({ user })
}


// helper function
function format(body) {
  const { id, firstName, lastName, email, role } = body
  return { id, firstName, lastName, email, role }
}
