function expressFlash(req, res, next) {
  if (req.hasOwnProperty('flash')) {
    res.locals.flash = req.flash;
  }
  if (req.session.hasOwnProperty('messages')) {
    res.locals.flash = req.session.messages;
    delete req.session.messages;
  }
  return next();
}

module.exports = expressFlash;