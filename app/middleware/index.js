module.exports = {
  templateVariables: require('./lib/template-variables'),
  userVariables: require('./lib/user-variables'),
  expressFlash: require('./lib/flash'),
  serverSideTemplates: require('./lib/server-side-templates'),
  canPlayRoleOf: require('./lib/is-role'),
  hasRoleOf: require('./lib/has-role')
};