$(document).ready(function () {
  // Getting references to the name input and container, as well as the table body

  var inventoryList = $("tbody");
  var inventoryContainer = $(".inventory-container");

  var inventoryHistoryList = $("#tbody-inv-hist");
  var inventoryHistoryContainer = $(".inventory-hist-container");

  // Adding event listeners
  $(document).on("click", ".laptop-link", getInventoryHistory);
  $(document).on("click", "#checkOutInventory", handleCheckout);
  $(document).on("click", ".checkout", renderCheckoutPopup);


  // Getting the initial list of Inventory
  getSpareInventories();


  function renderCheckoutPopup() {
    var listItemData = $(this)
      .parent("td")
      .parent("tr")
      .data("inventory");
    console.log($(listItemData));
    $("#selectedSN").text(listItemData.sn);
  }
  // A function to handle what happens when the form is submitted to create a new Inventory
  function handleCheckout(event) {
    event.preventDefault();

    var selectedSN = $("#selectedSN");
    var netId = $("#netId");
    var firstName = $("#firstName");
    var lastName = $("#lastName");
    var preferredName = $("#preferredName");
    var programName = $("#programName");
    var comments = $("#comments");
    if (
      !netId
        .val()
        .trim()
        .trim() ||
      !programName
        .val()
        .trim()
        .trim()
    ) {
      alert("Enter Net ID and Program!");
      return;
    }
    // Calling the upsertInventory function and passing in the value of the name input
    upsertCheckoutEvent({
      sn: selectedSN.html().trim(),
      netId: netId.val().trim(),
      firstName: firstName.val().trim(),
      lastName: lastName.val().trim(),
      preferredName: preferredName.val().trim(),
      program: programName.val().trim(),
      comments: comments.val().trim(),
      eventType: 'CHECK-OUT',
      updatedBy: 'user'
    });

    updateInventory({
      sn: selectedSN.html().trim(),
      assigned: "Y",
      assignedTo: netId.val().trim(),
      assignedBy: 'user'
    });
    //reset values

    selectedSN.val(""); 
    netId.val(""); 
    firstName.val(""); 
    lastName.val(""); 
    preferredName.val(""); 
    programName.val(""); 
    comments.val(""); 

    //hide Modal
    $(".modal").modal("hide");
  }

  // A function for creating an Inventory. Calls getinventories upon completion
  function upsertCheckoutEvent(data) {
    $.post("/api/event", data).then(getSpareInventories);
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
    var newTr = $("<tr>");
    newTr.data("inventory", inventoryData);
    newTr.append("<td><a href='' class = 'btn btn-link laptop-link' data-toggle='modal' data-target='#inventoryHistoryModal'>" + inventoryData.sn + "</a></td>");

    newTr.append("<td>" + inventoryData.powerAdapterSN + "</td>")
      ;
    var newTd = $("<td>");
    var checkOutBtn = $("<button>");
    checkOutBtn.text("Check Out");
    checkOutBtn.attr("sn", inventoryData.sn)
    checkOutBtn.addClass("checkout btn btn-info");
    checkOutBtn.attr("data-toggle", "modal");
    checkOutBtn.attr("data-target", "#checkOutInventoryModal");

    newTd.append(checkOutBtn)
    newTr.append(newTd);

    return newTr;
  }

  // Function for retrieving inventories and getting them ready to be rendered to the page
  function getSpareInventories() {
    inventoryList.empty();

    $.get("/api/inventory-spare", function (data) {
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
