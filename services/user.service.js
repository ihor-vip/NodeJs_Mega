const User = require("../dataBase/User.model");
module.exports = {
  getUsersWithCount: async (query = {}) => {

    const { limit = 20, page = 1, ...otherFilters } = query;
    const skip = (page - 1) * limit;

    let filterObject = {};

    if (otherFilters.search) {
      filterObject = {
        ...filterObject,
        $or: [
          { name: { $regex: otherFilters.search, $options: 'i' } },
          { email: { $regex: otherFilters.search, $options: 'i' } },
        ]
      }
    }

    if (otherFilters.age_gte) {
      filterObject = {
        ...filterObject,
        age: { $gte: +otherFilters.age_gte }
      }
    }

    if (otherFilters.age_lte) {
      filterObject = {
        ...filterObject,
        age: Object.assign(filterObject.age || {}, { $lte: +otherFilters.age_lte })
      }
    }

    const users = await User.find(filterObject).limit(limit).skip(skip);
    const count = await User.count(filterObject);

    return {
      page,
      perPage: limit,
      data: users,
      count
    }
  }
};
