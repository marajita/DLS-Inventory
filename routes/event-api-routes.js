var db = require("../models");

module.exports = function (app) {
  app.get("/api/event", function (req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Event.findAll().then(function (dbEvent) {
      res.json(dbEvent);
    });
  });

  app.get("/api/event/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Event.findAll({
      where: {
        sn: req.params.id
      }
    }).then(function (dbEvent) {
      res.json(dbEvent);
    });
  });

  app.post("/api/event", function (req, res) {
    db.Event.create(req.body).then(function (dbEvent) {
      res.json(dbEvent);
    });
  });

  app.delete("/api/event/:id", function (req, res) {
    db.Event.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbEvent) {
      res.json(dbEvent);
    });
  });

  app.put("/api/event", function(req, res) {
    db.Event.update(req.body, {
      where: {
        sn: req.body.sn
      }
    }).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });
};
