const fs = require('fs');
const crypto = require('crypto');

function discoverTemplateType(templatePath) {
  const matches = (templatePath || '').match(/\.(tpl\.js|(?:[^.]+))$/);
  return matches && matches[1];
}

function compileJSContent(content) {
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return function(options) { return ${content};}`)();
}

class Template {
  constructor(templatePath, content, kind) {
    this.templatePath = templatePath;
    this.content = content;
    this.kind = kind || discoverTemplateType(templatePath);
  }
  compile() {
    switch (this.kind) {
      case 'tpl.js':
      case 'js':
        if (fs.existsSync(this.templatePath)) {
          // eslint-disable-next-line global-require,import/no-dynamic-require
          this.compiledTemplate = require(this.templatePath);
        } else {
          this.compiledTemplate = compileJSContent(this.content);
        }
        break;
      default:
        throw new Error(`Unknown template type: ${this.kind}`);
    }
    return this;
  }
  exec(options, generator) {
    switch (this.kind) {
      case 'tpl.js':
      case 'js':
        return this.compiledTemplate(Object.assign({}, options, generator));
      default:
        throw new Error(`Unknown template type: ${this.kind}`);
    }
  }
}

const templateCache = {};
Template.compile = (templatePath, content, kind) => {
  if (!templateCache[templatePath]) {
    const template = new Template(templatePath, content, kind);
    templateCache[templatePath] = template.compile();
  }
  return templateCache[templatePath];
};

Template.fromTemplateContent = (content, kind, options, generator) => {
  const hash = crypto.createHash('md5').update(content).digest('hex');
  return Template.compile(hash, content, kind || 'js').exec(options, generator);
};

Template.fromTemplateFile = (filepath, options, generator) => {
  return Template.compile(filepath).exec(options, generator);
};

module.exports = Template;
