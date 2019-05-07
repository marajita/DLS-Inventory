$(document).ready(function() {
  // Getting references to the name input and container, as well as the table body
  var serialInput = $("#serialNo");
  var powerAdaptserialInput = $("#powerAdaptSerialNo");
  var inventoryList = $("tbody");
  var inventoryContainer = $(".inventory-container");

  // Adding event listeners
  $(document).on("click", ".edit-inventory", renderEditPopup);
  $(document).on("click", ".delete-inventory", handleDeleteButtonPress);
  $(document).on("click", "#addInventory", handleAddNewInventory);
  $(document).on("click", "#editInventory", handleEditInventory);

  // Getting the initial list of Inventory
  getInventories();

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
  function createInventoryRow(inventoryData) {
    var newTr = $("<tr>");
    newTr.data("inventory", inventoryData);
    newTr.append("<td>" + inventoryData.sn + "</td>");
    newTr.append("<td>" + inventoryData.powerAdapterSN + "</td>");
    newTr.append(
      "<td><i style='cursor:pointer' class='far fa-edit edit-inventory' data-toggle='modal' data-target='#editInventoryModal'></i> &nbsp &nbsp | &nbsp &nbsp <i style='cursor:pointer' class='far fa-trash-alt delete-inventory'></i></td>"
    );

    return newTr;
  }

  // Function for retrieving inventories and getting them ready to be rendered to the page
  function getInventories() {
    inventoryList.empty();

    $.get("/api/admin", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createInventoryRow(data[i]));
      }
      renderInventoryList(rowsToAdd);
      serialInput.val("");
      powerAdaptserialInput.val("");
    });
  }

  // A function for rendering the list of inventories to the page
  function renderInventoryList(rows) {
    inventoryList
      .children()
      .not(":last")
      .remove();
    inventoryContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      inventoryList.prepend(rows);
    } else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no inventories
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-info");
    alertDiv.text("No Records Found");
    inventoryContainer.append(alertDiv);
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
    }).then(function() {
      getInventories();
    });
  }
});
