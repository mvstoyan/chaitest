const puppeteer = require("puppeteer");
require("dotenv").config();

(async () => { // Asynchronous function that is immediately invoked
  const browser = await puppeteer.launch(); // Launch the browser
  const page = await browser.newPage(); // Create a new page
  await page.goto("https://example.com"); // Go to the specified URL
  await page.screenshot({ path: "example.png" }); // Take a screenshot of the page and save it to a file

  await browser.close(); // Close the browser
})();
