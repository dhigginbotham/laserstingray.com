var roles = require('../../../config').applicationRoles;

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
  };
}

function roleMiddleware(req, res, next) {
  req.canPlayRoleOf = res.locals.canPlayRoleOf = canPlayRoleOf(req.user);
  return next();
}

module.exports = roleMiddleware;