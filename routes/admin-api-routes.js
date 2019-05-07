var db = require("../models");

module.exports = function (app) {
  app.get("/api/admin", function (req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Laptop.findAll().then(function (dbLaptop) {
      res.json(dbLaptop);
    });
  });

  app.get("/api/admin/:id", function (req, res) {
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

  app.post("/api/admin", function (req, res) {
    db.Laptop.create(req.body).then(function (dbLaptop) {
      res.json(dbLaptop);
    });
  });

  app.delete("/api/admin/:id", function (req, res) {
    db.Laptop.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbLaptop) {
      res.json(dbLaptop);
    });
  });

  app.put("/api/admin", function(req, res) {
    db.Laptop.update(req.body, {
      where: {
        sn: req.body.sn
      }
    }).then(function(dbLaptop) {
      res.json(dbLaptop);
    });
  });
};
