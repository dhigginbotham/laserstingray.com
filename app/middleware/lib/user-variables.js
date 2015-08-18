module.exports = function userVariables(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};