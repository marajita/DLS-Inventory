$(document).ready(function () {
  var table;
  var dataSet = [];

  getStudents();


  // Adding event listeners
  $(document).on("click", ".edit-student", renderEditPopup);
  $(document).on("click", ".delete-student", handleDeleteButtonPress);
  $(document).on("click", "#addStudent", handleAddNewStudent);
  $(document).on("click", "#editStudent", handleEditStudent);

  // A function to handle what happens when the form is submitted to create a new Student
  function handleAddNewStudent(event) {
    event.preventDefault();
    // Don't do anything if the fields hasn't been filled out
    if (
      !serialInput
      .val()
      .trim()
      .trim() ||
      !powerAdaptserialInput
      .val()
      .trim()
      .trim()
    ) {
      alert("Enter fields!");
      return;
    }
    // Calling the upsertStudent function and passing in the value of the name input
    upsertStudent({
      sn: serialInput.val().trim(),
      powerAdapterSN: powerAdaptserialInput.val().trim()
    });

    //hide Modal
    $(".modal").modal("hide");
  }

  // A function for creating an Student. Calls getinventories upon completion
  function upsertStudent(data) {
    $.post("/api/admin", data).then(getInventories);
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
    studentData.action = "<i style='cursor:pointer' class='far fa-edit edit-student' data-toggle='modal' data-target='#editStudentModal'></i> &nbsp &nbsp | &nbsp &nbsp <i style='cursor:pointer' class='far fa-trash-alt delete-student'></i>";
    return studentData
  }

  // Function for retrieving inentories and getting them ready to be rendered to the page
  function getStudents() {
    $.get("/api/students", function (data) {
      for (var i = 0; i < data.length; i++) {
        dataSet.push(createStudentRow(data[i]));
      }
      initializeDatatable();
    });
    return dataSet;
  }

  async function initializeDatatable() {
    console.log("before table init");
    console.log(dataSet);

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
          data: "action",
          title: "Action"
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

  // A function for rendering the list of inventories to the page
  // function renderStudentStudentList(rows) {
  //   studentList
  //     .children()
  //     .not(":last")
  //     .remove();
  //   studentContainer.children(".alert").remove();
  //   if (rows.length) {
  //     console.log(rows);
  //     studentList.prepend(rows);
  //   } else {
  //     renderEmpty();
  //   }
  // }

  // Function for handling what to render when there are no inventories
  // function renderEmpty() {
  //   var alertDiv = $("<div>");
  //   alertDiv.addClass("alert alert-info");
  //   alertDiv.text("No Records Found");
  //   studentContainer.append(alertDiv);
  // }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    selectedRowData = table.row('.selected').data();
    var id = selectedRowData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/student/" + id
    }).then(getStudents());
  }

  function handleEditStudent() {
    console.log("Saving...");
    event.preventDefault();
    // var id = $("#id");
    selectedRowData = table.row('.selected').data();
    var id = selectedRowData.id;
    var netId = $("#netId");
    var lastName = $("#lastName");
    var firstName = $("#firstName");
    var preferredName = $("#preferredName");
    var dukeEmail = $("#dukeEmail");
    var altEmail = $("#altEmail");
    var laptopSN = $("#laptopSN");
    var powerAdapterSN = $("#powerAdapterSN");
    var programYear = $("#programYear");
    // Don't do anything if the name fields hasn't been filled out
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
    //Calling the upsertStudent function and passing in the value of the name input
    updateStudent({
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


  // Edit Student 
  function renderEditPopup() {
    console.log(table.row('.selected').data());
    selectedRowData = table.row('.selected').data();
    $("#netId").val(selectedRowData.netId);
    $("#lastName").val(selectedRowData.lastName);
    $("#firstName").val(selectedRowData.firstName);
    $("#preferredName").val(selectedRowData.preferredName);
    $("#dukeEmail").val(selectedRowData.dukeEmail);
    $("#altEmail").val(selectedRowData.altEmail);
    $("#laptopSN").val(selectedRowData.laptopSN);
    $("#powerAdapterSN").val(selectedRowData.powerAdapterSN);
    $("#programYear").val(selectedRowData.programYear);
  }

  function updateStudent(data) {
    console.log("updating..");
    console.log(data);

    $.ajax({
      method: "PUT",
      url: "/api/student",
      data: data
    }).then(function () {
      //getStudents();
      dataSet = [];
      $.get("/api/students", function (data) {
        for (var i = 0; i < data.length; i++) {
          dataSet.push(createStudentRow(data[i]));
        }
        table.draw();
      });
    });
  }
});
