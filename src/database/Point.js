const DB = require("./db.json");

const getAllPoints = () => {
  return DB;
};

module.exports = { getAllPoints };