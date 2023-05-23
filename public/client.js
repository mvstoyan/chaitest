document.addEventListener("DOMContentLoaded", () => {
  const addPerson = document.getElementById("addPerson");
  const getPerson = document.getElementById("getPerson");
  const listPeople = document.getElementById("listPeople");
  const name = document.getElementById("name");
  const age = document.getElementById("age");
  const index = document.getElementById("index");
  const result = document.getElementById("result");
  addPerson.addEventListener("click", async (event) => { // Event listener for the "Add Person" button click
    event.preventDefault();
    try {
      const response = await fetch("/api/v1/people", { // Send a POST request to add a new person
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, age: Number(age.value) }),
      });
      const data = await response.json();
      result.textContent = JSON.stringify(data);  // Display the response data
    } catch (err) {
      result.textContent = err.message;  // Display any error that occurred
    }
  });
  listPeople.addEventListener("click", async (event) => {  // Event listener for the "List People" button click
    event.preventDefault(); // Prevent form submission
    try {
      const response = await fetch("/api/v1/people", {   // Send a GET request to retrieve the list of people
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      result.textContent = JSON.stringify(data); // Display the response data
    } catch (err) {
      result.textContent = err.message;  // Display any error that occurred
    }
  });
  getPerson.addEventListener("click", async (event) => {  // Event listener for the "Get Person" button click
    event.preventDefault(); // Prevent form submission
    const index1 = encodeURIComponent(index.value); // Encode the index value
    console.log("index 1 is ", index1);
    try {
      const response = await fetch(`/api/v1/people/${index1}`, { // Send a GET request to retrieve a specific person by index
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      result.textContent = JSON.stringify(data); // Display the response data
    } catch (err) {
      result.textContent = err.message; // Display any error that occurred
    }
  });
});
