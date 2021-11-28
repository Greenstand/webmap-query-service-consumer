class Repository {
  constructor(repoImpl) {
    this.repoImpl = repoImpl;
  }

  async add(data) {
    return await this.repoImpl.add(data);
  }

  async update(data) {
    return await this.repoImpl.update(data);
  }

  async getByFilter(filterCriteria, options) {
    return await this.repoImpl.getByFilter(filterCriteria, options);
  }
}

module.exports = { Repository };
