const puppeteer = require("puppeteer");
require("dotenv").config();
const chai = require("chai");
const { server } = require("../app");

function sleep(ms) {  // Function to introduce a delay using promises
  return new Promise((resolve) => setTimeout(resolve, ms));
}

chai.should();

(async () => {  // Immediately invoked asynchronous function
  describe("Functional Tests with Puppeteer", function () { // Describe the functional tests using Puppeteer
    let browser = null;
    let page = null;
    before(async function () { // Before the tests, set up the browser and navigate to the site
      this.timeout(5000);
      browser = await puppeteer.launch(); // Launch a new browser instance using Puppeteer
      page = await browser.newPage(); // Create a new page within the browser
      await page.goto("http://localhost:3000"); // Navigate to the specified URL
    });
    after(async function () { // After the tests, close the browser and the server
      this.timeout(5000);
      await browser.close(); // Close the browser instance
      server.close(); // Close the server
      return;
    });
    describe("got to site", function () { // Test: Check if the connection to the site is completed
      it("should have completed a connection", function (done) {
        done();
      });
    });
    describe("people form", function () { // Test: Check various elements in the people form
      this.timeout(5000);
      it("should have various elements", async function () {
        // Find and verify the presence of different form elements
        this.nameField = await page.$("input[name=name]"); // Find the input field with name attribute "name"
        this.nameField.should.not.equal(null); // Assert that the input field exists
        this.ageField = await page.$("input[name=age]");
        this.ageField.should.not.equal(null);
        this.resultHandle = await page.$("#result");
        this.resultHandle.should.not.equal(null);
        this.addPerson = await page.$("#addPerson");
        this.addPerson.should.not.equal(null);
        this.personIndex = await page.$("#index");
        this.personIndex.should.not.equal(null);
        this.getPerson = await page.$("#getPerson");
        this.getPerson.should.not.equal(null);
        this.listPeople = await page.$("#listPeople");
        this.listPeople.should.not.equal(null);
      });
      it("should create a person record given name and age", async function () {
        // Enter name and age, click the addPerson button, and wait for a response
        await this.nameField.type("Fred"); // Enter "Fred" in the name input field
        await this.ageField.type("10"); // Enter "10" in the age input field
        await this.addPerson.click(); // Click the addPerson button
        await sleep(200); // Wait for 200 milliseconds
        const resultData = await ( // Retrieve the text content of the result element and check if it contains the success message
          await this.resultHandle.getProperty("textContent")
        ).jsonValue();
        console.log("at 1, resultData is ", resultData);
        resultData.should.include("A person entry was added"); // Assert that the resultData includes the success message
        const { index } = JSON.parse(resultData); // Parse the result data to extract the index and store it for later tests
        this.lastIndex = index;  // Store the index value in the test context
        // Using object destructuring to extract the index property from the parsed object. { index } or {index:index}
        // Assigning the extracted index value to the lastIndex property of the current context (this).
        // parses a JSON string, extracts the value of the index property from the resulting object, and assigns it 
        // to the lastIndex property for further use. 
      });
      it("should not create a person record without an age", async function () {
        await this.ageField.type("Jim"); // Enter "Jim" in the age input field
        await page.$eval("#age", (el) => (el.value = "")); // clears input field
        await this.addPerson.click(); // Click the addPerson button
        await sleep(200); // Wait for 200 milliseconds
        const resultData = await (
          await this.resultHandle.getProperty("textContent")
        ).jsonValue();
        console.log("at 2, resultData is ", resultData);
        resultData.should.include("Please enter an age."); // Assert that the resultData includes the error message
      });
      it("should return the entries just created", async function () {
        await this.listPeople.click(); // Click the listPeople button
        await sleep(200); // Wait for 200 milliseconds
        const resultData = await (
          await this.resultHandle.getProperty("textContent")
        ).jsonValue();
        console.log("at 3, resultData is ", resultData);
        resultData.should.include("Fred"); // Assert that the resultData includes the name "Fred"
      });
      it("should return the last entry.", async function () {
        await this.personIndex.type(`${this.lastIndex}`); // Enter the last index value in the personIndex input field
        await this.getPerson.click(); // Click the listPeople button
        await sleep(200); // Wait for 200 milliseconds
        const resultData = await (
          await this.resultHandle.getProperty("textContent")
        ).jsonValue();
        console.log("at 4, resultData is ", resultData);
        resultData.should.include("Fred");  // Assert that the resultData includes the name "Fred"
      });
    });
  });
})();
