'use strict';

class TokenService {
  constructor(sequelize) {
    this._Token = sequelize.models.Token;
  }

  async add(refresh) {
    const token = await this._Token.create({refresh});
    return token.get();
  }

  async find(refresh) {
    const token = await this._Token.findOne({where: {refresh}});
    return token;
  }

  async delete(refresh) {
    const token = await this._Token.destroy({where: {refresh}});
    return Boolean(token);
  }
}

module.exports = TokenService;
