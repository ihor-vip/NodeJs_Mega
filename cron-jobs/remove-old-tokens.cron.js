const dayJs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const OAuth = require('../dataBase/OAuth.model');

dayJs.extend(utc)

module.exports = async () => {
  const sevenDaysBeforeNow = dayJs().utc().subtract(7, 'days');

  const query = await OAuth.deleteMany({ createdAt: {$lte: sevenDaysBeforeNow} });

  console.log(query);
};
