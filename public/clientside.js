//Samson DeVol, clientside.js for Database INteractions and UI, CS290, 3-12-2021

//Set up DOM manipulation
var req = new XMLHttpRequest();
req.open("GET", "/get-data", true);
req.setRequestHeader('Content-Type', 'application/json');
req.addEventListener('load',function(){
  if(req.status >= 200 && req.status < 400){
    createTable(JSON.parse(req.responseText));
  }
 });


//Create an empty table via DOM and populate via array passed
function createTable(dataArray){
  var tableDiv = document.getElementById("completedtable");
  if(tableDiv.firstChild != null){
    tableDiv.removeChild(tableDiv.firstChild);
  }
  var table = document.createElement("table");
  table.style.border = "2px solid black";
  var head = document.createElement("tr");
  head.style.backgroundColor = "lightblue";
  var header1 = document.createElement("th");
  header1.innerText = "Name";
  head.appendChild(header1);
  var header2 = document.createElement("th");
  header2.innerText = "Date";
  head.appendChild(header2);
  var header3 = document.createElement("th");
  header3.innerText = "Reps";
  head.appendChild(header3);
  var header4 = document.createElement("th");
  header4.innerText = "Weight";
  head.appendChild(header4);
  var header5 = document.createElement("th");
  header5.innerText = "Unit";
  head.appendChild(header5);
  var header6 = document.createElement("th");
  header6.innerText = "Edit";
  head.appendChild(header6);
  var header7 = document.createElement("th");
  header7.innerText = "Delete";
  head.appendChild(header7);
  table.appendChild(head);

  // For each exercise in the returned array, add a row and put in the exercise data
  dataArray.forEach(function(row){ 
    var addrow = document.createElement("tr");
    var name = document.createElement("td");
    name.innerText = row["name"];
    addrow.appendChild(name);
     var date = document.createElement("td");
    if(row["date"] != null){
      date.innerText = row["date"].substring(0,10);
    }
    addrow.appendChild(date);
    var rep= document.createElement("td");
    rep.innerText = row["reps"];
    addrow.appendChild(rep);
    var weight = document.createElement("td");
    weight.innerText = row["weight"];
    addrow.appendChild(weight);
    var units = document.createElement("td");
    if(row["lbs"] == 1){
     units.innerText = "lbs";
    }
    else if(row["lbs"] == 0){
      units.innerText = "kgs";
    }
    addrow.appendChild(units);

    //Add the edit button with listener to call edit function.
    var editbutton = document.createElement("td");
    var form = document.createElement('form');
    var inputId = document.createElement('input');
    inputId.setAttribute('type',"hidden");
    inputId.setAttribute('value',row["id"]);
    var button = document.createElement('input');
    button.setAttribute('type',"button");
    button.setAttribute('value', "Edit");
    button.setAttribute('class', "edit");
    button.addEventListener('click', editFunction, false);
    form.appendChild(inputId);
    form.appendChild(button);
    editbutton.appendChild(form);
    addrow.appendChild(editbutton);

    //Add delete button with listener to call delete function. 
    var deletebutton = document.createElement("td");
    var form = document.createElement('form');
    var inputId = document.createElement('input');
    inputId.setAttribute('type',"hidden");
    inputId.setAttribute('value',row["id"]);
    var button = document.createElement('input');
    button.setAttribute('type',"button");
    button.setAttribute('value', "Delete");
    button.setAttribute('class', "delete");
    button.addEventListener('click', deleteFunction, false);
    form.appendChild(inputId);
    form.appendChild(button);
    deletebutton.appendChild(form);
    addrow.appendChild(deletebutton);
    table.appendChild(addrow);
  });
  tableDiv.appendChild(table);
}

//Send the added excersize to createTable and POST to /add route
document.getElementById("addexercise").addEventListener("click", function(event){
  var req = new XMLHttpRequest();
  var values = {date:null, name:null, reps:null, weight:null, unit:null};
  values.date = document.getElementById('adddate').value || null;
  document.getElementById('adddate').value = null;
  values.name = document.getElementById('addname').value || null;
  document.getElementById('addname').value = null;
  values.reps = document.getElementById('addreps').value || null;
  document.getElementById('addreps').value = null;
  values.weight = document.getElementById('addweight').value || null;
  document.getElementById('addweight').value = null;
  if(document.getElementById('addunit').checked == true){
    values.unit = 1;
  }
  else{
    values.unit = 0;
  }

  req.open("POST", "/insert", true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      createTable(JSON.parse(req.responseText));
    }
    else {
      console.log("Error in network request: " + req.statusText);
    }
  });
  req.send(JSON.stringify(values));
  event.preventDefault();
});

//Send the deleted excersize to POST route to /delete
function deleteFunction(event){
  var req = new XMLHttpRequest();
  var id = this.previousSibling.value;
  var values = {"id":id};
  req.open("POST", "/delete", true);
  req.setRequestHeader("Content-Type","application/json");
  req.addEventListener("load",function(){
    if(req.status >= 200 && req.status < 400){
      createTable(JSON.parse(req.responseText));
    }
    else {
        console.log("Error in network request: " + req.statusText);
      }
  });
  req.send(JSON.stringify(values));
}

//Create input boxes and populate with current data
function editFunction(event){
  var updateButtons = document.getElementsByClassName("update");
  if(updateButtons.length > 0){
      alert("Another exercise is already being modified!");
      return;
  }
  var spot = this.parentElement.parentElement.parentElement; 
  var newname = document.createElement("input");
  newname.setAttribute("value",spot.children[0].innerText);
  newname.setAttribute("type", "text");
  newname.setAttribute("id","updatename");
  spot.children[0].innerText = "";
  spot.children[0].appendChild(newname);  
  var newdate = document.createElement("input");
  newdate.setAttribute("value",spot.children[1].innerText);
  newdate.setAttribute("type", "date");
  newdate.setAttribute("id","updatedate");
  spot.children[1].innerText = "";
  spot.children[1].appendChild(newdate);
  var newreps = document.createElement("input");
  newreps.setAttribute("value",spot.children[2].innerText);
  newreps.setAttribute("type", "number");
  newreps.setAttribute("id","updatereps");
  spot.children[2].innerText = "";
  spot.children[2].appendChild(newreps);
  var newweight = document.createElement("input");
  newweight.setAttribute("value",spot.children[3].innerText);
  newweight.setAttribute("type", "number");
  newweight.setAttribute("id","updateweight");
  spot.children[3].innerText = "";
  spot.children[3].appendChild(newweight);
  
  //Select instead of radio or input, took way too long to figure this out :/
  var newunit = document.createElement("select");
  newunit.setAttribute("id","updateunit");
  var pounds = document.createElement("option");
  pounds.setAttribute("value","1")
  pounds.innerText = "lbs";
  newunit.appendChild(pounds);
  var kilograms = document.createElement("option");
  kilograms.setAttribute("value","0")
  kilograms.innerText = "kgs";
  newunit.appendChild(kilograms);
  if(spot.children[4].innerText == "lbs"){
    pounds.selected = true;
  }
  else{
    kilograms.selected = true;
  }
  spot.children[4].innerText = "";
  spot.children[4].appendChild(newunit);

  //Add Submit button
  var id = this.previousSibling.value;
  spot.children[5].innerHTML = '';
  var form = document.createElement('form');
  var updateButton = document.createElement('form');
  var inputId = document.createElement('input');
  inputId.setAttribute('type',"hidden");
  inputId.setAttribute('value',id);
  var button = document.createElement('input');
  button.setAttribute('type',"button");
  button.setAttribute('value', "Submit");
  button.addEventListener("click", updateFunction, false);
  form.appendChild(inputId);
  form.appendChild(button);
  spot.children[5].appendChild(form);
}

//Update the values based on the current DOM node and POST route to /update
function updateFunction(event){
  var id = this.previousSibling.value;
  var req = new XMLHttpRequest();
  var values = {id:null, date:null, name:null, reps:null, weight:null, unit:null};
  values.name = document.getElementById('updatename').value;
  values.date = document.getElementById('updatedate').value || null;
  values.reps = document.getElementById('updatereps').value || null;
  values.weight = document.getElementById('updateweight').value || null;
  values.unit = document.getElementById('updateunit').value;
  values.id = id;
  req.open("POST", "/safe-update", true);
  req.setRequestHeader('Content-Type', 'application/json');

  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      createTable(JSON.parse(req.responseText));
    }
  });
  req.send(JSON.stringify(values));
}
