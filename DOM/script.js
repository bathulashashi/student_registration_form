// Wrap JS to ensure DOM is loaded if needed
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationform");
  const nameInput = document.getElementById("studentname");
  const idInput = document.getElementById("studentid");
  const emailInput = document.getElementById("email");
  const contactInput = document.getElementById("contact");
  const tableBody = document.querySelector("#studenttable tbody");
  const displaySection = document.getElementById("display-section");

  let students = JSON.parse(localStorage.getItem("students")) || [];
  let editIndex = null;

  function renderTable() {
    tableBody.innerHTML = "";
    students.forEach((student, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.studentId}</td>
        <td>${student.email}</td>
        <td>${student.contact}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      // Add event listeners to buttons
      row.querySelector(".edit-btn").addEventListener("click", () => editStudent(index));
      row.querySelector(".delete-btn").addEventListener("click", () => deleteStudent(index));

      tableBody.appendChild(row);
    });

    if (students.length > 5) {
      displaySection.style.overflowY = "scroll";
      displaySection.style.maxHeight = "400px";
    } else {
      displaySection.style.overflowY = "auto";
      displaySection.style.maxHeight = "unset";
    }
  }

  function editStudent(index) {
    const student = students[index];
    nameInput.value = student.name;
    idInput.value = student.studentId;
    emailInput.value = student.email;
    contactInput.value = student.contact;
    editIndex = index;
  }

  function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this record?")) {
      students.splice(index, 1);
      localStorage.setItem("students", JSON.stringify(students));
      renderTable();

      if (editIndex === index) {
        form.reset();
        editIndex = null;
      }
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const studentId = idInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();

    // Validation
    if (!name || !studentId || !email || !contact) {
      alert("Please fill in all fields.");
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      alert("Name must contain only letters and spaces.");
      return;
    }
    if (!/^\d+$/.test(studentId)) {
      alert("Student ID must be numeric.");
      return;
    }
    if (!/^\d+$/.test(contact)) {
      alert("Contact number must be numeric.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const student = { name, studentId, email, contact };

    if (editIndex === null) {
      students.push(student);
    } else {
      students[editIndex] = student;
      editIndex = null;
    }

    localStorage.setItem("students", JSON.stringify(students));
    form.reset();
    renderTable();
  });

  // Render table on load
  renderTable();
});
