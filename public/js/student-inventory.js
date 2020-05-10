$(document).ready(function () {

  var dataSet = [];

  getStudentInventories();




  // A function to handle what happens when the form is submitted to create a new Inventory
  function handleAddNewInventory(event) {
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
    // Calling the upsertInventory function and passing in the value of the name input
    upsertInventory({
      sn: serialInput.val().trim(),
      powerAdapterSN: powerAdaptserialInput.val().trim()
    });

    //hide Modal
    $(".modal").modal("hide");
  }

  // A function for creating an Inventory. Calls getinventories upon completion
  function upsertInventory(data) {
    $.post("/api/admin", data).then(getInventories);
  }

  // Function for creating a new list row for Inventories
  function createInventoryRow(studentInventoryData) {
    var studentData = [];
    studentData.push(studentInventoryData.netId + 1);
    studentData.push(studentInventoryData.lastName);
    studentData.push(studentInventoryData.firstName);
    studentData.push(studentInventoryData.preferredName);
    studentData.push(studentInventoryData.dukeEmail);
    studentData.push(studentInventoryData.altEmail);
    studentData.push(studentInventoryData.laptopSN);
    studentData.push(studentInventoryData.powerAdapterSN);
    studentData.push(studentInventoryData.programYear);
    console.log(studentData);
    return studentData;
  }

  // Function for retrieving inventories and getting them ready to be rendered to the page
  function getStudentInventories() {
    // dataSet = [];

    $.get("/api/students", function (data) {
      for (var i = 0; i < data.length; i++) {
        dataSet.push(createInventoryRow(data[i]));
      }
      //renderStudentInventoryList(rowsToAdd);
      // resetting pop up values to null.
      // serialInput.val("");
      // powerAdaptserialInput.val("");
      console.log("before table init");
      console.log(dataSet);

      $('#studentTable').DataTable({
        data: dataSet,
        columns: [{
            title: "Net ID"
          },
          {
            title: "Last Name"
          },
          {
            title: "First Name"
          },
          {
            title: "Preferred Name"
          },
          {
            title: "Duke Email"
          },
          {
            title: "Alternate Email"
          },
          {
            title: "Laptop SN"
          },
          {
            title: "Power Adapter SN"
          },
          {
            title: "Program Year"
          }
        ],
        dom: 'Bfrtip',        // element order: NEEDS BUTTON CONTAINER (B) ****
        select: 'single',     // enable single row selection
        responsive: true,     // enable responsiveness
        altEditor: true,      // Enable altEditor ****
        buttons: [{
          text: 'Add',
          name: 'add'        // DO NOT change name
        },
        {
          extend: 'selected', // Bind to Selected row
          text: 'Edit',
          name: 'edit'        // DO NOT change name
        },
        {
          extend: 'selected', // Bind to Selected row
          text: 'Delete',
          name: 'delete'      // DO NOT change name
       }],
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
    });
  }

  // A function for rendering the list of inventories to the page
  function renderStudentInventoryList(rows) {
    studentInventoryList
      .children()
      .not(":last")
      .remove();
    studentInventoryContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      studentInventoryList.prepend(rows);
    } else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no inventories
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-info");
    alertDiv.text("No Records Found");
    studentInventoryContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this)
      .parent("td")
      .parent("tr")
      .data("inventory");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/admin/" + id
    }).then(getInventories);
  }

  function handleEditInventory() {
    event.preventDefault();
    var serialInput = $("#serialNoEdit");
    var powerAdaptserialInput = $("#powerAdaptSerialNoEdit");
    // Don't do anything if the name fields hasn't been filled out
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
    // Calling the upsertInventory function and passing in the value of the name input
    updateInventory({
      sn: serialInput.val().trim(),
      powerAdapterSN: powerAdaptserialInput.val().trim()
    });

    //hide Modal
    $(".modal").modal("hide");
  }


  //Edit Inventory 
  function renderEditPopup() {
    var listItemData = $(this)
      .parent("td")
      .parent("tr")
      .data("inventory");
    console.log($(listItemData));
    $("#serialNoEdit").val(listItemData.sn);
    $("#powerAdaptSerialNoEdit").val(listItemData.powerAdapterSN);
  }

  function updateInventory(data) {
    $.ajax({
      method: "PUT",
      url: "/api/admin",
      data: data
    }).then(function () {
      getInventories();
    });
  }
});
