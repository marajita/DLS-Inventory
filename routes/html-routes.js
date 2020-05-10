// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function (app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/dashboard.html"));
  });


  app.get("/inventory-spare", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/inventory-spare.html"));
  });

  app.get("/inventory-assigned", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/inventory-assigned.html"));
  });

  // cms route loads cms.html
  app.get("/cms", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/cms.html"));
  });

  // blog route loads blog.html
  app.get("/blog", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/blog.html"));
  });

  // authors route loads author-manager.html
  app.get("/authors", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/author-manager.html"));
  });

    // admin
    app.get("/admin", function (req, res) {
      res.sendFile(path.join(__dirname, "../public/admin.html"));
    });

      // about
  app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/about.html"));
  });

    // contact
    app.get("/contact", function (req, res) {
      res.sendFile(path.join(__dirname, "../public/contact.html"));
    });
    // student inventory
    app.get("/template", function (req, res) {
      res.sendFile(path.join(__dirname, "../public/template.html"));
    });
  // template
  app.get("/students", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/student-inventory.html"));
  });

  // template
  app.get("/temp", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index5.html"));
  });
};
