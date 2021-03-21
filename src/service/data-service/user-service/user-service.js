'use strict';
const bcrypt = require(`bcrypt`);

const saltRounds = 10;

class UsersService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(newUser) {
    const {password} = newUser;
    const pwHash = await bcrypt.hash(password, saltRounds);

    const user = await this._User.create({...newUser, password: pwHash});
    return user.get();
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email}
    });

    return user;
  }
}

module.exports = UsersService;
