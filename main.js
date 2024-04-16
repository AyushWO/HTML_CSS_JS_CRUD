function submitForm(event) {
  event.preventDefault();
  const valid = validateForm();
  if (valid) {
    const id = Math.floor(Math.random() * Date.now());
    const name = document.getElementById("name").value;
    const skills = getSelectedSkills();
    const salary = document.getElementById("salary").value;
    const dob = document.getElementById("dob").value;

    const employee = {
      id: id.toString(),
      name: name,
      skills: skills,
      salary: salary,
      dob: dob,
    };

    updateLocalStorage(employee);
    clearForm();
    updateAdvanceTable();
  }
}

function validateForm() {
  let isValid = true;

  const name = document.getElementById("name").value;
  const errorName = document.getElementById("errorName");
  if (name === "" || /\d/.test(name) || name==null || name==undefined) {
    errorName.textContent = "(Please Enter Name without Numbers)";
    isValid = false;
  } else {
    errorName.textContent = "";
  }

  const salary = document.getElementById("salary").value;
  const errorSalary = document.getElementById("errorSalary");
  if (salary === "" || isNaN(salary || salary==null || salary==undefined)) {
    errorSalary.textContent = "(Please Enter Salary)";
    isValid = false;
  } else {
    errorSalary.textContent = "";
  }

  const dob = document.getElementById("dob").value;
  const errorDob = document.getElementById("errorDob");
  if (dob === ""  || dob==null || dob==undefined) {
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
       <td><button class="btnJS deleteBtn" onclick="deleteEmployee(${
         employee.id
       })">Delete</button> <button class="btnJS updateBtn" onclick="updateEmployee(${
      employee.id
    })">Update</button></td>
    `;
  }
}

function updateLocalStorage(employee) {
  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  const index = employees.findIndex((emp) => emp.id === employee.id.toString());

  const updatedEmployee = {
    id: employee.id.toString(),
    name: employee.name,
    skills: employee.skills,
    salary: employee.salary,
    dob: employee.dob,
  };

  if (index !== -1) {
    employees[index] = updatedEmployee;
  } else {
    employees.push(updatedEmployee);
  }

  localStorage.setItem("employees", JSON.stringify(employees));

  addOrUpdateEmployee(updatedEmployee);
  clearForm();
  updateAdvanceTable();
}

function loadFromLocalStorage() {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.forEach((employee) => {
    updateLocalStorage(employee);
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
  let employees = JSON.parse(localStorage.getItem("employees")) || [];

  tableRows.forEach((row, index) => {
    if (row.cells[0].textContent === id.toString()) {
      tableBody.deleteRow(index);
      employees = employees.filter((emp) => emp.id !== id.toString());
      localStorage.setItem("employees", JSON.stringify(employees));
    }
  });

  clearForm();
  updateAdvanceTable();
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
      document.getElementById("btnClearinsert").style.display = "none";
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

  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  const index = employees.findIndex((emp) => emp.id === id);
  if (index !== -1) {
    const valid = validateForm();
    if (valid) {
      employees[index].name = name;
      employees[index].skills = skills;
      employees[index].salary = salary;
      employees[index].dob = dob;

      localStorage.setItem("employees", JSON.stringify(employees));

      addOrUpdateEmployee(employees[index]);
      clearForm();

      document.getElementById("headingInsertOrUpdate").innerHTML =
        "<u>Registration Form</u>";
      document.getElementById("btn1").style.display = "inline";
      document.getElementById("btnClearinsert").style.display = "inline";
      document.getElementById("btnUpdate").style.display = "none";
      document.getElementById("btnInsert").style.display = "none";

      location.reload();
    } else {
      console.error("Validation failed. Cannot update employee.");
    }
  } else {
    console.error("Employee not found for update");
  }
}

function insertEmployeeDataPage() {
  clearForm();
  document.getElementById("headingInsertOrUpdate").innerHTML =
    "<u>Registration Form</u>";
  document.getElementById("btn1").style.display = "inline";
  document.getElementById("btnClearinsert").style.display = "inline";
  document.getElementById("btnUpdate").style.display = "none";
  document.getElementById("btnInsert").style.display = "none";
}

function updateAdvanceTable() {
  const advanceTableBody = document.getElementById("advanceTableBody");
  advanceTableBody.innerHTML = "";

  const tableBody = document.getElementById("tableBody");
  const numRows = tableBody.rows.length;

  const headerRow = advanceTableBody.insertRow();
  headerRow.innerHTML = `<th>Name</th>`;
  for (let i = 0; i < numRows; i++) {
    const nameCell = headerRow.insertCell();
    nameCell.textContent = tableBody.rows[i].cells[1].textContent;
  }

  const skillsRow = advanceTableBody.insertRow();
  skillsRow.innerHTML = `<th>Skills</th>`;
  for (let i = 0; i < numRows; i++) {
    const skillsCell = skillsRow.insertCell();
    skillsCell.textContent = tableBody.rows[i].cells[2].textContent;
  }

  const salaryRow = advanceTableBody.insertRow();
  salaryRow.innerHTML = `<th>Salary</th>`;
  for (let i = 0; i < numRows; i++) {
    const salaryCell = salaryRow.insertCell();
    salaryCell.textContent = tableBody.rows[i].cells[3].textContent;
  }

  const dobRow = advanceTableBody.insertRow();
  dobRow.innerHTML = `<th>Date of Birth</th>`;
  for (let i = 0; i < numRows; i++) {
    const dobCell = dobRow.insertCell();
    dobCell.textContent = tableBody.rows[i].cells[4].textContent;
  }

  const actionRow = advanceTableBody.insertRow();
  actionRow.innerHTML = `<th>Action</th>`;
  for (let i = 0; i < numRows; i++) {
    const actionCell = actionRow.insertCell();
    actionCell.innerHTML = tableBody.rows[i].cells[5].innerHTML;
  }
}

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
