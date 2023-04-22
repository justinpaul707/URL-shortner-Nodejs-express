const { Sequelize, DataTypes } = require("sequelize");

const node_env = process.env.NODE_ENV;
if (node_env == "development") {
  var config = require("./config/config").development;
} else {
  var config = require("./config/config").production;
}
const UrlShortnerModel = require("./models/UrlShortner");

let timezone=process.env.TZ_UTC
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: JSON.parse(config.logging),
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false,
      // },
    },
    timezone
  }
);
async () => {
  await sequelize
    .query("SET FOREIGN_KEY_CHECKS = 0", { raw: true })
    .then(function (results) {
      sequelize.sync({});
    });
};


const UrlShortner =  UrlShortnerModel(sequelize, DataTypes);


module.exports = {
  UrlShortner,
  //sequelize
  sequelize
};
