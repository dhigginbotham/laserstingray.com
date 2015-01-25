var roles = {
  optin: 1,
  user: 3,
  admin: 10
};

function canPlayRoleOf(user) {
  return function(role) {
    if (user) {
      if (roles.hasOwnProperty(role)) {
        return (user.role >= roles[role] ? true : false);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

function roleMiddleware(req, res, next) {
  req.canPlayRoleOf = res.locals.canPlayRoleOf = canPlayRoleOf(req.user);
  return next();
}

module.exports = roleMiddleware;