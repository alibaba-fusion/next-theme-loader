const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function(source) {
  const query = loaderUtils.getOptions ? loaderUtils.getOptions(this) : loaderUtils.parseQuery(this.query);

  const theme = query.theme;
  const base = query.base;

  // resolve to node_modules of cwd
  const themeVarsStr = theme ? `@import "${path.resolve(process.cwd(), 'node_modules', theme, 'variables.scss')}";\n` : '';
  const baseVarsStr = base ? `@import "${path.resolve(process.cwd(), 'node_modules', base, 'variables.scss')}";\n` : '';

  const modifyVars = query.modifyVars;
  let modifyVarsStr = '';
  if (modifyVars) {
    if (typeof modifyVars === 'object') {
      modifyVarsStr = convertObj2Scss(modifyVars);
    } else if (typeof modifyVars === 'string') {
      modifyVarsStr = `@import "${modifyVars}";\n`;
    }
  }

  return `${themeVarsStr}${modifyVarsStr}${baseVarsStr}${source}`;
};

function convertObj2Scss(modifyVarsObj) {
  return Object.keys(modifyVarsObj).reduce((ret, name) => {
    return ret + `${name}: ${modifyVarsObj[name]};\n`;
  }, '');
}
