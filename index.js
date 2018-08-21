const loaderUtils = require('loader-utils');

module.exports = function(source) {
  const query = loaderUtils.getOptions ? loaderUtils.getOptions(this) : loaderUtils.parseQuery(this.query);

  const theme = query.theme;
  const themeVarsStr = theme ? `@import "~${theme}/variables.scss";\n` : '';

  const modifyVars = query.modifyVars;
  let modifyVarsStr = '';
  if (modifyVars) {
    if (typeof modifyVars === 'object') {
      modifyVarsStr = convertObj2Scss(modifyVars);
    } else if (typeof modifyVars === 'string') {
      modifyVarsStr = `@import "${modifyVars}";\n`;
    }
  }

  return `${themeVarsStr}${modifyVarsStr}${source}`;
};

function convertObj2Scss(modifyVarsObj) {
  return Object.keys(modifyVarsObj).reduce((ret, name) => {
    return ret + `${name}: ${modifyVarsObj[name]};\n`;
  }, '');
}
