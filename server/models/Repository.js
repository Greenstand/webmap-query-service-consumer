class Repository {
  constructor(repoImpl) {
    this.repoImpl = repoImpl;
  }

  async add(data) {
    return this.repoImpl.add(data);
  }

  async update(data) {
    return this.repoImpl.update(data);
  }

  async getByFilter(filterCriteria, options) {
    return this.repoImpl.getByFilter(filterCriteria, options);
  }
}

module.exports = { Repository };
