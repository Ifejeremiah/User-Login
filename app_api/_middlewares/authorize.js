const jwt = require('express-jwt');
const secret = process.env.AUTH_SECRET;
const { db } = require('../_config');

const { errorResponse } = require('./responses');

module.exports = function authorize(roles = []) {
  if (typeof roles === 'string') roles = [roles];

  return [
    jwt({ secret, algorithms: ['HS256'] }),

    async (req, res, next) => {
      const user = await db.User.findById(req.user.id);

      if (!user || (roles.length && !roles.includes(user.role))) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      req.user.role = user.role;
      const refreshTokens = await db.RefreshToken.find({ userId: user.id });
      req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
      next();
    }
  ];
}