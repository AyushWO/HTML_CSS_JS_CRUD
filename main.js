function submitForm(event) {
  event.preventDefault();
  const valid = validateForm();
  if (valid) {
    const id = document.getElementById("id").value = Math.floor(Math.random() * Date.now());
    const name = document.getElementById("name").value;
    const skills = getSelectedSkills();
    const salary = document.getElementById("salary").value;
    const dob = document.getElementById("dob").value;

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

function validateForm() {
  let isValid = true;
  
  const name = document.getElementById("name").value;
  const errorName = document.getElementById("errorName");
  if (name === "" || /\d/.test(name)) {
    errorName.textContent = "(Please Enter Name without Numbers)";
    isValid = false;
  } else {
    errorName.textContent = "";
  }

  const salary = document.getElementById("salary").value;
  const errorSalary = document.getElementById("errorSalary");
  if (salary === "" || isNaN(salary)) {
    errorSalary.textContent = "(Please Enter Salary)";
    isValid = false;
  } else {
    errorSalary.textContent = "";
  }

  const dob = document.getElementById("dob").value;
  const errorDob = document.getElementById("errorDob");
  if (dob === "") {
    errorDob.textContent = "(Please Enter Date of Birth)";
    isValid = false;
  } else {
    const ageValid = getAge();
    if (!ageValid) {
      errorDob.textContent = "Age should be 18 or above.";
      isValid = false;
    } else {
      errorDob.textContent = "";
    }
  }

  return isValid;
}

function getAge() {
  const dobSmallError = document.getElementById("errorDob");
  const dateString = document.getElementById("dob").value;

  const parts = dateString.split("-");
  const dtDOB = new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2])
  );
  const dtCurrent = new Date();
  let age = dtCurrent.getFullYear() - dtDOB.getFullYear();

  if (
    dtCurrent.getMonth() < dtDOB.getMonth() ||
    (dtCurrent.getMonth() === dtDOB.getMonth() &&
      dtCurrent.getDate() < dtDOB.getDate())
  ) {
    age--;
  }

  if (age < 18) {
    dobSmallError.innerHTML = "Age should be 18 or above.";
    return false;
  } else {
    dobSmallError.innerHTML = "";
    return true;
  }
}

function getSelectedSkills() {
  const skills = [];
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  checkboxes.forEach((checkbox) => {
    skills.push(checkbox.value);
  });
  return skills;
}

function addOrUpdateEmployee(employee) {
  const tableBody = document.getElementById("tableBody");
  let existingEmployee = false;

  tableBody.querySelectorAll("tr").forEach((row) => {
    if (row.cells[0].textContent === employee.id.toString()) {
      row.cells[1].textContent = employee.name;
      row.cells[2].textContent = employee.skills.join(", ");
      row.cells[3].textContent = employee.salary;
      row.cells[4].textContent = employee.dob;
      existingEmployee = true;
      updateLocalStorage();
    }
  });

  if (!existingEmployee) {
    const row = tableBody.insertRow();
    row.innerHTML = `
       <td style="display: none;">${employee.id}</td>
       <td>${employee.name}</td>
       <td>${employee.skills.join(", ")}</td>
       <td>${employee.salary}</td>
       <td>${employee.dob}</td>
       <td><button class="btnJS deleteBtn" onclick="deleteEmployee(${employee.id})">Delete</button> <button class="btnJS updateBtn" onclick="updateEmployee(${employee.id})">Update</button></td>
        `;
    updateLocalStorage();
  }
}

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

function loadFromLocalStorage() {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.forEach((employee) => {
    addOrUpdateEmployee(employee);
  });
}

function clearForm() {
  document.getElementById("id").value = "";
  document.getElementById("name").value = "";
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      checkbox.checked = false;
    });
  document.getElementById("salary").value = "";
  document.getElementById("dob").value = "";
}

function deleteEmployee(id) {
  const tableBody = document.getElementById("tableBody");
  const tableRows = tableBody.querySelectorAll("tr");
  tableRows.forEach((row, index) => {
    if (row.cells[0].textContent === id.toString()) {
      tableBody.deleteRow(index);
      updateLocalStorage();
    }
  });
  clearForm();
}

function updateEmployee(id) {
  clearForm();
  const tableBody = document.getElementById("tableBody");
  const tableRows = tableBody.querySelectorAll("tr");

  tableRows.forEach((row) => {
    if (row.cells[0].textContent === id.toString()) {
      document.getElementById("id").value = row.cells[0].textContent;
      document.getElementById("name").value = row.cells[1].textContent;
      const skills = row.cells[2].textContent.split(", ");
      skills.forEach((skill) => {
        const checkbox = document.querySelector(`input[value="${skill}"]`);
        if (checkbox) {
          checkbox.checked = true;
        }
      });
      document.getElementById("salary").value = row.cells[3].textContent;
      document.getElementById("dob").value = row.cells[4].textContent;

      document.getElementById("headingInsertOrUpdate").innerHTML =
        "<u>Updating Form</u>";
      document.getElementById("btn1").style.display = "none";
      document.getElementById("btnUpdate").style.display = "inline";
      document.getElementById("btnInsert").style.display = "inline";
    }
  });
}

function updateEmployeeData() {
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const skills = getSelectedSkills();
  const salary = document.getElementById("salary").value;
  const dob = document.getElementById("dob").value;

  if (name && salary && dob) {
    const employee = {
      id: id,
      name: name,
      skills: skills,
      salary: salary,
      dob: dob,
    };

    addOrUpdateEmployee(employee);
    clearForm();

    document.getElementById("headingInsertOrUpdate").innerHTML =
      "<u>Registration Form</u>";
    document.getElementById("btn1").style.display = "inline";
    document.getElementById("btnUpdate").style.display = "none";
    document.getElementById("btnInsert").style.display = "none";
  }
}

function insertEmployee() {
  clearForm();
  document.getElementById("headingInsertOrUpdate").innerHTML =
    "<u>Registration Form</u>";
  document.getElementById("btn1").style.display = "inline";
  document.getElementById("btnUpdate").style.display = "none";
  document.getElementById("btnInsert").style.display = "none";
}

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
