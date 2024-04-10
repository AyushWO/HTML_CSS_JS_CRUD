function submitForm(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const skills = getSelectedSkills();
  const salary = document.getElementById("salary").value;
  const dob = document.getElementById("dob").value;

  if (name && skills.length > 0 && salary && dob) {
    const employee = {
      name: name,
      skills: skills,
      salary: salary,
      dob: dob,
    };

    addEmployee(employee);
    saveToLocalStorage();
    clearForm();
  } else if (name == "" || name === null) {
    document.getElementById("errorName").innerHTML = "Please enter your name";
  } else if (salary === "" && salary === null) {
    document.getElementById("errorSalary").innerHTML =
      "Please enter your salary";
  } else if (dob === "" && dob === null) {
    document.getElementById("errorDob").innerHTML =
      "Please enter your Date Of Birth";
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

function addEmployee(employee) {
  const tableBody = document.getElementById("tableBody");
  const row = tableBody.insertRow();
  row.innerHTML = `
       <td>${employee.name}</td>
       <td>${employee.skills.join(", ")}</td>
       <td>${employee.salary}</td>
       <td>${employee.dob}</td>
       <td><button style="background-color: rgb(255, 153, 0); color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;" onclick="deleteEmployee(this)">Delete</button> <button style="background-color: rgb(255, 153, 0); color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;" onclick="updateEmployee(this)">Update</button></td>
        `;
}

function saveToLocalStorage() {
  let employees = [];
  const tableRows = document.querySelectorAll("#tableBody tr");
  tableRows.forEach((row) => {
    const name = row.cells[0].textContent;
    const skills = row.cells[1].textContent.split(", ");
    const salary = row.cells[2].textContent;
    const dob = row.cells[3].textContent;
    employees.push({ name, skills, salary, dob });
  });
  localStorage.setItem("employees", JSON.stringify(employees));
}

function loadFromLocalStorage() {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.forEach((employee) => {
    addEmployee(employee);
  });
}

function clearForm() {
  document.getElementById("name").value = "";
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checkbox) => (checkbox.checked = false));
  document.getElementById("salary").value = "";
  document.getElementById("dob").value = "";
}

function deleteEmployee(button) {
  const row = button.parentNode.parentNode;
  console.log(button);
  row.parentNode.removeChild(row);
  saveToLocalStorage();
}

function updateEmployee(employee) {
  const tableBody = document.getElementById("tableRow");
  const row = tableBody.insertRow();
  loadFromLocalStorage();
  row.innerHTML = `
       <td>${employee.name}</td>
       <td>${employee.skills.join(", ")}</td>
       <td>${employee.salary}</td>
       <td>${employee.dob}</td>
       <td><button style="background-color: rgb(255, 153, 0); color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;" onclick="deleteEmployee(this)">Delete</button> <button style="background-color: rgb(255, 153, 0); color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;" onclick="updateEmployee(this)">Update</button></td>
        `;
}

function saveUpdate(button) {}

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
