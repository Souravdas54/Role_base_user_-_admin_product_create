const jwt = require('jsonwebtoken');

function Auth(req, res, next) {
  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    const { adminToken, userToken } = req.cookies || {};

    req.admin = null;
    req.user = null;

    // Verify adminToken
    if (adminToken) {
      try {
        const decodedAdmin = jwt.verify(adminToken, secret);
        if (decodedAdmin.role === 'admin') {
          req.admin = decodedAdmin;
        }
      } catch (e) {
        res.clearCookie('adminToken', { path: '/' });
      }
    }

    // Verify userToken
    if (userToken) {
      try {
        const decodedUser = jwt.verify(userToken, secret);
        if (decodedUser.role === 'user') {
          req.user = decodedUser;
        }
      } catch (e) {
        res.clearCookie('userToken', { path: '/' });
      }
    }

    // Continue regardless of which role is authenticated
    return next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.redirect('/');
  }
}

module.exports = Auth;
