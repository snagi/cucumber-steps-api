module.exports = (options) => {
  return {
    id: options.guid(),
    uuidv1: options.uuid.v1(),
    uuidv4: options.uuid.v4(),
    name: options.faker.name.findName(),
    address: {
      line1: options.chance.address(),
      city: options.chance.city()
    }
  };
}