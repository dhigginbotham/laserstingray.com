var roles = {
  optin: 1,
  user: 3,
  admin: 10
};

function canPlayRoleOf(user, role) {
  if (roles.hasOwnProperty(role)) {
    return (user.role >= roles[role] ? true : false);
  } else {
    return null;
  }
}

function roleMiddleware(req, res, next) {
  if (req.user) {
    req.canPlayRoleOf = canPlayRoleOf;
  }
  next();
}

module.exports = roleMiddleware;