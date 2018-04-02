module.exports = type =>
  ({
    json: 'application/json',
    xml: 'application/xml',
    form: 'application/x-www-form-urlencoded',
    formdata: 'application/x-www-form-urlencoded',
    multipart: 'multipart/form-data',
  }[type.toLowerCase().replace(/[-_]/g, '')] || type);
