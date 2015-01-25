function serverSideTemplates(templatePath) {
  return function(req, res) {
    if (!req.params.file) return res.redirect('/');
    if (templatePath[templatePath.length-1] != '/') {
      templatePath + '/';
    }
    res.render(templatePath + req.params.file);
  };
}

module.exports = serverSideTemplates;