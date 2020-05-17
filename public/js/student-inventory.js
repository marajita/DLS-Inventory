//global variables
var table;
var dataSet = [];

$(document).ready(function () {
  getStudents(initializeDatatable);

  // Adding event listeners
  $(document).on("click", ".add-student", renderAddPopup);
  $(document).on("click", ".edit-student", renderEditPopup);
  $(document).on("click", "#addStudent", handleAddNewStudent);
  $(document).on("click", "#editStudent", handleEditStudent);
});

// adding on row select actions to add css class selected
$('#studentTable tbody').on('click', 'tr', function () {
  if ($(this).hasClass('selected')) {
    $(this).removeClass('selected');
  } else {
    table.$('tr.selected').removeClass('selected');
    $(this).addClass('selected');
  }
});

// Function for retrieving students and getting them ready to be rendered to the page
function getStudents(callback) {
  dataSet = [];
  $.get("/api/students", function (data) {
    for (var i = 0; i < data.length; i++) {
      dataSet.push(createStudentRow(data[i]));
    }
    callback();
  });
  return dataSet;
}

function drawTable() {
  table.destroy();
  initializeDatatable();
}

function initializeDatatable() {
  table = $('#studentTable').DataTable({
    data: dataSet,
    columns: [{
        data: "id",
        title: "ID"
      }, {
        data: "netId",
        title: "Net ID"
      },
      {
        data: "lastName",
        title: "Last Name"
      },
      {
        data: "firstName",
        title: "First Name"
      },
      {
        data: "preferredName",
        title: "Preferred Name"
      },
      {
        data: "dukeEmail",
        title: "Duke Email"
      },
      {
        data: "altEmail",
        title: "Alternate Email"
      },
      {
        data: "laptopSN",
        title: "Laptop SN"
      },
      {
        data: "powerAdapterSN",
        title: "Power Adapter SN"
      },
      {
        data: "programYear",
        title: "Program Year"
      },
      {
        data: "edit",
        title: "Edit"
      }
    ],
    select: "single",
    responsive: true, // enable responsiveness
    initComplete: function () {
      this.api().columns().every(function () {
        var column = this;
        var select = $('<select><option value=""></option></select>')
          .appendTo($(column.footer()).empty())
          .on('change', function () {
            var val = $.fn.dataTable.util.escapeRegex(
              $(this).val()
            );

            column
              .search(val ? '^' + val + '$' : '', true, false)
              .draw();
          });

        column.data().unique().sort().each(function (d, j) {
          select.append('<option value="' + d + '">' + d + '</option>')
        });
      });
    }
  });
}

// ################# Add student functionalities ####################

// Render student pop up
function renderAddPopup() {
  $("#netIdAdd").val("");
  $("#lastNameAdd").val("");
  $("#firstNameAdd").val("");
  $("#preferredNameAdd").val("");
  $("#dukeEmailAdd").val("");
  $("#altEmailAdd").val("");
  $("#laptopSNAdd").val("");
  $("#powerAdapterSNAdd").val("");
  $("#programYearAdd").val("");
}

// A function to handle what happens when the form is submitted to create a new Student
function handleAddNewStudent(event) {
  event.preventDefault();

  var netId = $("#netIdAdd");
  var lastName = $("#lastNameAdd");
  var firstName = $("#firstNameAdd");
  var preferredName = $("#preferredNameAdd");
  var dukeEmail = $("#dukeEmailAdd");
  var altEmail = $("#altEmailAdd");
  var laptopSN = $("#laptopSNAdd");
  var powerAdapterSN = $("#powerAdapterSNAdd");
  var programYear = $("#programYearAdd");
  // Don't do anything if the fields hasn't been filled out
  if (
    !netId
    .val()
    .trim() ||
    !lastName
    .val()
    .trim() ||
    !firstName
    .val()
    .trim() ||
    !dukeEmail
    .val()
    .trim() ||
    !programYear
    .val()
    .trim()
  ) {
    alert("Enter Required fields!");
    return;
  }
  // Calling the upsertStudent function and passing in the value of the name input
  upsertStudent({
    netId: netId.val().trim(),
    lastName: lastName.val().trim(),
    firstName: firstName.val().trim(),
    preferredName: preferredName.val().trim(),
    dukeEmail: dukeEmail.val().trim(),
    altEmail: altEmail.val().trim(),
    laptopSN: laptopSN.val().trim(),
    powerAdapterSN: powerAdapterSN.val().trim(),
    programYear: programYear.val().trim()
  });

  //hide Modal
  $(".modal").modal("hide");
}

// A function for creating an Student. Calls getinventories upon completion
function upsertStudent(data) {
  console.log(data);
  $.post("/api/student", data).then(getStudents(drawTable));
}

//#################### EDIT Student ################

// Edit Student render
function renderEditPopup() {
  selectedRowData = table.row('.selected').data();
  $("#netIdEdit").val(selectedRowData.netId);
  $("#lastNameEdit").val(selectedRowData.lastName);
  $("#firstNameEdit").val(selectedRowData.firstName);
  $("#preferredNameEdit").val(selectedRowData.preferredName);
  $("#dukeEmailEdit").val(selectedRowData.dukeEmail);
  $("#altEmailEdit").val(selectedRowData.altEmail);
  $("#laptopSNEdit").val(selectedRowData.laptopSN);
  $("#powerAdapterSNEdit").val(selectedRowData.powerAdapterSN);
  $("#programYearEdit").val(selectedRowData.programYear);
}

// On save on edit pop up
function handleEditStudent() {
  event.preventDefault();
  selectedRowData = table.row('.selected').data();
  var id = selectedRowData.id;
  var netId = $("#netIdEdit");
  var lastName = $("#lastNameEdit");
  var firstName = $("#firstNameEdit");
  var preferredName = $("#preferredNameEdit");
  var dukeEmail = $("#dukeEmailEdit");
  var altEmail = $("#altEmailEdit");
  var laptopSN = $("#laptopSNEdit");
  var powerAdapterSN = $("#powerAdapterSNEdit");
  var programYear = $("#programYearEdit");
  if (
    !netId
    .val()
    .trim() ||
    !lastName
    .val()
    .trim() ||
    !firstName
    .val()
    .trim() ||
    !dukeEmail
    .val()
    .trim() ||
    !programYear
    .val()
    .trim()
  ) {
    alert("Enter Required fields!");
    return;
  }
  //Calling the updateStudent
  updateStudent({
    id: id,
    netId: netId.val().trim(),
    lastName: lastName.val().trim(),
    firstName: firstName.val().trim(),
    preferredName: preferredName.val().trim(),
    dukeEmail: dukeEmail.val().trim(),
    altEmail: altEmail.val().trim(),
    laptopSN: laptopSN.val().trim(),
    powerAdapterSN: powerAdapterSN.val().trim(),
    programYear: programYear.val().trim()
  });

  //hide Modal
  $(".modal").modal("hide");
}

function updateStudent(data) {
  $.ajax({
    method: "PUT",
    url: "/api/student",
    data: data
  }).then(getStudents(drawTable));
}

// Function for creating a new list row for Inventories
function createStudentRow(student) {
  var studentData = {};
  studentData.id = student.id;
  studentData.netId = student.netId;
  studentData.lastName = student.lastName;
  studentData.firstName = student.firstName;
  studentData.preferredName = student.preferredName;
  studentData.dukeEmail = student.dukeEmail;
  studentData.altEmail = student.altEmail;
  studentData.laptopSN = student.laptopSN;
  studentData.powerAdapterSN = student.powerAdapterSN;
  studentData.programYear = student.programYear;
  studentData.data = student;
  studentData.edit = "<i style='cursor:pointer' class='far fa-edit edit-student' data-toggle='modal' data-target='#editStudentModal'></i>";
  return studentData
}
// &nbsp &nbsp | &nbsp &nbsp <i style='cursor:pointer' class='far fa-trash-alt delete-student'></i>