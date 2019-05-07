var db = require("../models");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = function (app) {
  app.get("/api/inventory", function (req, res) {
    db.Laptop.findAll().then(function (dbLaptop) {
      res.json(dbLaptop);
    });
  });

  app.get("/api/inventory-spare", function (req, res) {
    db.Laptop.findAll({
      where: {
        assigned: {[Op.or]:[null, 'N']}
      }
    }).then(function (dbLaptop) {
      res.json(dbLaptop);
    });
  });

  app.get("/api/inventory-assigned", function (req, res) {
    db.Laptop.findAll({
      where: {
        assigned: 'Y'
      }
    }).then(function (dbLaptop) {
      res.json(dbLaptop);
    });
  });

  app.get("/api/inventory/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Laptop.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbLaptop) {
      res.json(dbLaptop);
    });
  });

  app.post("/api/inventory", function (req, res) {
    db.Laptop.create(req.body).then(function (dbLaptop) {
      res.json(dbLaptop);
    });
  });

  app.delete("/api/inventory/:id", function (req, res) {
    db.Laptop.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbLaptop) {
      res.json(dbLaptop);
    });
  });

  app.put("/api/inventory", function (req, res) {
    db.Laptop.update(req.body, {
      where: {
        sn: req.body.sn
      }
    }).then(function (dbLaptop) {
      res.json(dbLaptop);
    });
  });
};
