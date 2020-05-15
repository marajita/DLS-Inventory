var db = require("../models");

module.exports = function (app) {
  app.get("/api/students", function (req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Student.findAll().then(function (dbStudent) {
      res.json(dbStudent);
    });
  });

  app.get("/api/student/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Student.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbStudent) {
      res.json(dbStudent);
    });
  });

  app.post("/api/student", function (req, res) {
    db.Student.create(req.body).then(function (dbStudent) {
      res.json(dbStudent);
    });
  });

  app.delete("/api/student/:id", function (req, res) {
    db.Student.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbStudent) {
      res.json(dbStudent);
    });
  });

  app.put("/api/student", function(req, res) {
    db.Student.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function(dbStudent) {
      res.json(dbStudent);
    });
  });
};
