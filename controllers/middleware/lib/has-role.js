var roles = require('../../../config').applicationRoles;

function hasRoleOf(user) {

  function hasAllRoles(roleSum) {
    return (roleSum & user.role) >= roleSum;
  }

  function hasAnyRoles(roleSum) {
    return (roleSum & user.role) > 0;
  }

  return function(role) {
    if (user) {
      role = (typeof role === 'string' ? [role] : role);
      var roleSum = role.reduce(function(last, curr, indx, list) {
        return last + (roles[list[indx]] || 0);
      }, 0);
      return hasAllRoles(roleSum);
    } else {
      return null;
    }
  };
}

function hasRoleOfMiddleware(req, res, next) {
  req.hasRoleOf = res.locals.hasRoleOf = hasRoleOf(req.user);
  return next();
}

module.exports = hasRoleOfMiddleware;