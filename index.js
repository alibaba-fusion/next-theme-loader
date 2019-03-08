const loaderUtils = require('loader-utils');

module.exports = function(source) {
  const query = loaderUtils.getOptions ? loaderUtils.getOptions(this) : loaderUtils.parseQuery(this.query);

  const theme = query.theme;
  const base = query.base;

  const themeVarsStr = theme ? `@import "~${theme}/variables.scss";\n` : '';
  const themeIconStr = theme ? `$css-prefix: "next-" !default;\n@import "~${theme}/icons.scss";\n` : '';
  const baseVarsStr = base ? `@import "~${base}/variables.scss";\n` : '';

  const modifyVars = query.modifyVars;
  let modifyVarsStr = '';
  if (modifyVars) {
    if (typeof modifyVars === 'object') {
      modifyVarsStr = convertObj2Scss(modifyVars);
    } else if (typeof modifyVars === 'string') {
      modifyVarsStr = `@import "${modifyVars}";\n`;
    }
  }

  return `${themeVarsStr}${themeIconStr}${modifyVarsStr}${baseVarsStr}${source}`;
};

function convertObj2Scss(modifyVarsObj) {
  return Object.keys(modifyVarsObj).reduce((ret, name) => {
    return ret + `${name}: ${modifyVarsObj[name]};\n`;
  }, '');
}
