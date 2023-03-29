const { faker } = require('@faker-js/faker');
const User = require('../../../dataBase/User.model');

module.exports = (userData = {}) => {
  const userToCreate = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    phone: faker.phone.number('+38#########'),
    age: faker.random.numeric(2),
    password: faker.internet.password(8),
    ...userData
  }

  return User.saveUserWithHashPassword(userToCreate);
}
