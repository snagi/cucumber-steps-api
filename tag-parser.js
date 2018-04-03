module.exports = (tags) => {
  const tagHashMap = tags
    .map((tag) => {
      if (tag.startsWith('~@')) {
        return { tag: tag.slice(1), negated: true };
      }
      return { tag, negated: false };
    })
    .reduce((map, item) => {
      const hash = map;
      hash[item.tag] = !!item.negated;
      return hash;
    }, {});

  const expressionParts = Object.keys(tagHashMap).reduce(
    (parts, tag) => {
      if (tagHashMap[tag]) {
        parts.excludes.push(tag);
      } else {
        parts.includes.push(tag);
      }
      return parts;
    },
    { includes: [], excludes: [] }
  );
  const expression = (expressionParts.includes.length
    ? [`(${expressionParts.includes.join(' or ')})`]
    : []
  )
    .concat(expressionParts.excludes.map(tag => `not ${tag}`))
    .join(' and ');

  return expression;
};

const t = module.exports(['@test', '~@mock']);