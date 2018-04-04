const mime = require('../../support/mime');

describe('Mime type resolution', () => {
  it('should be an function', () => {
    expect(typeof mime).toBe('function');
  });

  it('should resolve mime type based on mapping', () => {
    expect(mime('json')).toBe('application/json');
    expect(mime('xml')).toBe('application/xml');
    expect(mime('form')).toBe('application/x-www-form-urlencoded');
    expect(mime('formdata')).toBe('application/x-www-form-urlencoded');
    expect(mime('multipart')).toBe('multipart/form-data');
  });

  it('should resolve mime type to same value when no mapping is found', () => {
    expect(mime('unknown')).toBe('unknown');
    expect(mime('application/some-random-value')).toBe('application/some-random-value');
    expect(mime('application/json')).toBe('application/json');
  });
});
