// Function to submit the form
function submitForm(event) {
  event.preventDefault();
  if (getAge()) { // Check age validation before submitting the form
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const skills = getSelectedSkills();
    const salary = document.getElementById("salary").value;
    const dob = document.getElementById("dob").value;

    if (name && skills.length > 0 && salary && dob) {
      const employee = {
        id: id,
        name: name,
        skills: skills,
        salary: salary,
        dob: dob,
      };

      addOrUpdateEmployee(employee);
      clearForm();
    }
  }
}

// Function to display validation messages
function validationMessage() {
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const skills = getSelectedSkills();
  const salary = document.getElementById("salary").value;
  const dob = document.getElementById("dob").value;

  const errorMessageId = (id === "" || id === null || !/^\d+$/.test(id)) ? "(Please Enter Id with Digits)" : "";
  const errorMessageName = (name === "" || /\d/.test(name)) ? "(Please Enter Name without Numbers)" : "";
  const errorMessageSkills = (skills.length === 0) ? "(Please select at least one Skill)" : "";
  const errorMessageSalary = (salary == "" || isNaN(salary)) ? "(Please Enter Salary)" : "";
  const errorMessageDob = (dob == "") ? "(Please Enter Date of Birth)" : "";

  document.getElementById("errorId").innerHTML = errorMessageId;
  document.getElementById("errorName").innerHTML = errorMessageName;
  document.getElementById("errorSkills").innerHTML = errorMessageSkills;
  document.getElementById("errorSalary").innerHTML = errorMessageSalary;
  document.getElementById("errorDob").innerHTML = errorMessageDob;

  // If validation passed, return true, else false
  return !(errorMessageId || errorMessageName || errorMessageSkills || errorMessageSalary || errorMessageDob);
}

// Function to calculate age
function getAge() {
  const lblError = document.getElementById("errorDob");
  const dateString = document.getElementById("dob").value;

  const parts = dateString.split("-");
  const dtDOB = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])); // Create a Date object with the provided date
  const dtCurrent = new Date(); // Get current date
  let age = dtCurrent.getFullYear() - dtDOB.getFullYear(); // Calculate age difference

  if (dtCurrent.getMonth() < dtDOB.getMonth() || (dtCurrent.getMonth() === dtDOB.getMonth() && dtCurrent.getDate() < dtDOB.getDate())) {
    age--; // Adjust age if birthday hasn't occurred yet this year
  }

  if (age < 18) {
    lblError.innerHTML = "Age should be 18 or above.";
    return false;
  } else {
    lblError.innerHTML = "";
    return true;
  }
}


// Function to get selected skills
function getSelectedSkills() {
  const skills = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach((checkbox) => {
    skills.push(checkbox.value);
  });
  return skills;
}

// Function to add or update an employee
function addOrUpdateEmployee(employee) {
  const tableBody = document.getElementById("tableBody");
  let existingEmployee = false;

  // Check if an employee with the same ID already exists
  tableBody.querySelectorAll("tr").forEach((row) => {
    if (row.cells[0].textContent === employee.id.toString()) {
      // If employee exists, update their information
      row.cells[1].textContent = employee.name;
      row.cells[2].textContent = employee.skills.join(", ");
      row.cells[3].textContent = employee.salary;
      row.cells[4].textContent = employee.dob;
      existingEmployee = true;
      updateLocalStorage();
    }
  });

  // If employee doesn't exist, add a new one
  if (!existingEmployee) {
    const row = tableBody.insertRow();
    row.innerHTML = `
       <td>${employee.id}</td>
       <td>${employee.name}</td>
       <td>${employee.skills.join(", ")}</td>
       <td>${employee.salary}</td>
       <td>${employee.dob}</td>
       <td><button class="btnJS deleteBtn" onclick="deleteEmployee(${employee.id})">Delete</button> <button class="btnJS updateBtn" onclick="updateEmployee(${employee.id})">Update</button></td>
        `;
    updateLocalStorage();
  }
}

// Function to save employees to local storage
function updateLocalStorage() {
  const tableBody = document.getElementById("tableBody");
  const employees = [];
  tableBody.querySelectorAll("tr").forEach((row) => {
    const id = row.cells[0].textContent;
    const name = row.cells[1].textContent;
    const skills = row.cells[2].textContent.split(", ");
    const salary = row.cells[3].textContent;
    const dob = row.cells[4].textContent;
    employees.push({ id, name, skills, salary, dob });
  });
  localStorage.setItem("employees", JSON.stringify(employees));
}

// Function to load employees from local storage
function loadFromLocalStorage() {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.forEach((employee) => {
    addOrUpdateEmployee(employee);
  });
}

// Function to clear form fields
function clearForm() {
  document.getElementById("id").value = "";
  document.getElementById("name").value = "";
  document.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
    checkbox.checked = false;
  });
  document.getElementById("salary").value = "";
  document.getElementById("dob").value = "";
}

// Function to delete an employee
function deleteEmployee(id) {
  const tableBody = document.getElementById("tableBody");
  const tableRows = tableBody.querySelectorAll("tr");
  tableRows.forEach((row, index) => {
    if (row.cells[0].textContent === id.toString()) {
      tableBody.deleteRow(index);
      updateLocalStorage();
    }
  });
}

// Function to update an employee
function updateEmployee(id) {
  const tableBody = document.getElementById("tableBody");
  const tableRows = tableBody.querySelectorAll("tr");

  // Find the employee with the given ID
  tableRows.forEach((row) => {
    if (row.cells[0].textContent === id.toString()) {
      // Populate form fields with existing employee data
      document.getElementById("id").value = row.cells[0].textContent;
      document.getElementById("name").value = row.cells[1].textContent;
      const skills = row.cells[2].textContent.split(", ");
      skills.forEach((skill) => {
        document.querySelector(`input[value="${skill}"]`).checked = true;
      });
      document.getElementById("salary").value = row.cells[3].textContent;
      document.getElementById("dob").value = row.cells[4].textContent;

      // Change form title and button text
      document.querySelector("h1").innerHTML = "<u>Updating Form</u>";
      document.getElementById("btn1").innerHTML = "Update";
      document.getElementById("btn1").setAttribute("onclick", `updateEmployeeData(${id})`);
    }
  });
}

// Function to update employee data
function updateEmployeeData(id) {
  const name = document.getElementById("name").value;
  const skills = getSelectedSkills();
  const salary = document.getElementById("salary").value;
  const dob = document.getElementById("dob").value;

  if (name && skills.length > 0 && salary && dob) {
    const employee = {
      id: id,
      name: name,
      skills: skills,
      salary: salary,
      dob: dob,
    };

    addOrUpdateEmployee(employee);
    clearForm();

    // Reset form title and button text to default values
    document.querySelector("h1").innerHTML = "<u>Registration Form</u>";
    document.getElementById("btn1").innerHTML = "Insert";
    document.getElementById("btn1").setAttribute("onclick", "submitForm(event)");
  }
}

// Load employees from local storage when the page is loaded
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
