$(document).ready(function () {
  // Getting references to the name input and container, as well as the table body

  var inventoryList = $("tbody");
  var inventoryContainer = $(".inventory-container");

  var inventoryHistoryList = $("#tbody-inv-hist");

  // Adding event listeners
  $(document).on("click", ".laptop-link", getInventoryHistory);
  $(document).on("click", "#checkInInventory", handleCheckIn);
  $(document).on("click", ".checkin", renderCheckInPopup);


  // Getting the initial list of Inventory
  getAssignedInventory();


  function renderCheckInPopup() {
    var listItemData = $(this)
      .parent("td")
      .parent("tr")
      .data("inventory");
    $("#selectedSN").text(listItemData.sn);
    $("#netId").val(listItemData.assignedTo);
  }
  // A function to handle what happens when the form is submitted to create a new Inventory
  function handleCheckIn(event) {
    event.preventDefault();

    var selectedSN = $("#selectedSN");
    var netId = $("#netId");
    var comments = $("#comments");
    if (
      !netId
        .val()
        .trim()
        .trim() ||
      !comments
        .val()
        .trim()
        .trim()
    ) {
      alert("Enter Net ID and Comments!");
      return;
    }
    // Calling the upsertInventory function and passing in the value of the name input
    upsertCheckInEvent({
      sn: selectedSN.html().trim(),
      netId: netId.val().trim(),
      comments: comments.val().trim(),
      eventType: 'CHECK-IN',
      updatedBy: 'user'
    });

    updateInventory({
      sn: selectedSN.html().trim(),
      assigned: "N",
      assignedTo: null,
      assignedBy: null
    });

    //reset
    selectedSN.val(""); 
    netId.val("");
    comments.val("");

    //hide Modal
    $(".modal").modal("hide");
  }

  // A function for creating an Inventory. Calls getinventories upon completion
  function upsertCheckInEvent(data) {
    $.post("/api/event", data).then(getAssignedInventory);
  }

  function updateInventory(data) {
    console.log(data.sn);
    $.ajax({
      method: "PUT",
      url: "/api/admin",
      data: data
    }).then(function () {
    });
  }

  // Function for creating a new list row for Inventories
  function createInventoryRow(inventoryData) {
    var formattedDate = new Date(inventoryData.updatedAt);
    formattedDate = moment(formattedDate).format("MM/DD/YYYY");
    
    var newTr = $("<tr>");
    newTr.data("inventory", inventoryData);
    newTr.append("<td><a href='' class = 'btn btn-link laptop-link' data-toggle='modal' data-target='#inventoryHistoryModal'>" + inventoryData.sn + "</a></td>");
    newTr.append("<td>" + inventoryData.powerAdapterSN + "</td>");
    newTr.append("<td>" + inventoryData.assignedTo + "</td>");
    newTr.append("<td>" + formattedDate + "</td>");
    newTr.append("<td>" + inventoryData.assignedBy + "</td>");
    newTr.append("<td>Comments Here TBD</td>");

    var newTd = $("<td>");
    var CheckInBtn = $("<button>");
    CheckInBtn.text("Check In");
    CheckInBtn.attr("sn", inventoryData.sn)
    CheckInBtn.addClass("checkin btn btn-info");
    CheckInBtn.attr("data-toggle", "modal");
    CheckInBtn.attr("data-target", "#checkInInventoryModal");

    newTd.append(CheckInBtn)
    newTr.append(newTd);

    return newTr;
  }

  // Function for retrieving inventories and getting them ready to be rendered to the page
  function getAssignedInventory() {
    inventoryList.empty();

    $.get("/api/inventory-assigned", function (data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createInventoryRow(data[i]));
      }
      renderInventoryList(rowsToAdd);
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

  // Inventory History
  function getInventoryHistory() {
    inventoryHistoryList.empty();
    var laptopData = $(this)
      .parent("td")
      .parent("tr")
      .data("inventory");

    $.get("/api/event/" + laptopData.sn, function (data) {
      console.log(data);
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createInventoryHistoryRow(data[i]));
      }
      renderInventoryHistoryList(rowsToAdd);
    });
    $("#selectedSN-eventHist").text(laptopData.sn);
    $("#inventoryHistoryModal").modal("show");


  }

  function createInventoryHistoryRow(inventoryEventData) {
    var formattedDate = new Date(inventoryEventData.createdAt );
    formattedDate = moment(formattedDate).format("MM-DD-YYYY HH:MM");
    var newTr = $("<tr>");
    newTr.data("inventory", inventoryEventData);
    newTr.append("<td>" + inventoryEventData.netId + "</td>");
    newTr.append("<td>" + inventoryEventData.firstName + "</td>");
    newTr.append("<td>" + inventoryEventData.lastName + "</td>");
    newTr.append("<td>" + inventoryEventData.preferredName + "</td>");
    newTr.append("<td>" + inventoryEventData.program + "</td>");
    newTr.append("<td>" + inventoryEventData.eventType + "</td>");
    newTr.append("<td>" + formattedDate + "</td>");
    newTr.append("<td>" + inventoryEventData.updatedBy + "</td>");
    newTr.append("<td>" + inventoryEventData.comments + "</td>");
    return newTr;
  }

  function renderInventoryHistoryList(rows) {
    inventoryHistoryList.prepend(rows);

  }


});
