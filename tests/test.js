const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server } = require("../app");

chai.use(chaiHttp);
chai.should();

describe("People", () => { // Test suite for the "People" endpoints
  after(() => { // After all tests, close this server
    server.close();
  });
  describe("post /api/v1/people", () => { // Test for POST /api/v1/people endpoint: creating a people entry without a name
    it("should not create a people entry without a name", (done) => { // Start the test for creating a people entry without a name
      chai
        .request(app) // Send the request to the Express app
        .post("/api/v1/people") // Specify the endpoint URL
        .send({ age: 10 }) // Send the request body
        .end((err, res) => { // Handle the response
          res.should.have.status(400); // Assert that the response has a status code of 400 (Bad Request)
          res.body.should.be.eql({ error: "Please enter a name." }); // Assert that the response body is equal to { error: "Please enter a name." }
          done(); // Complete the test
        });
    });
    it("should create a people entry with valid input", (done) => { // Start the test for creating a people entry with valid input
      chai
        .request(app) // Send the request to the Express app
        .post("/api/v1/people") // Specify the endpoint URL
        .send({ name: "Scarlett", age: 3 }) // Send the request body
        .end((err, res) => { // Handle the response
          res.should.have.status(201); // here is 201 status - created, not 200(OK)
          res.body.should.contain({ message: "A person entry was added." }); // Assert that the response body contains the expected message
          this.lastIndex = res.body.index; // Store the index of the last person added for use in subsequent tests
          done(); // Complete the test
        });
    });
  });
  describe("get /api/v1/people", () => { // Test for GET /api/v1/people endpoint: retrieving an array of person entries
    it(`should return an array of person entries of length ${this.lastIndex + 1}`, (done) => { // Start the test for retrieving an array of person entries
      chai
      .request(app) // Send the request to the Express app
      .get("/api/v1/people") // Specify the endpoint URL
      .end((err, res) => { // Handle the response
        res.should.have.status(200); // Assert that the response has a status code of 200 (OK)
        res.body.should.have.length(this.lastIndex + 1); // Assert that the response body has the expected length
        done(); // Complete the test
      });
    });
  });
  describe("get /apl/v1/people/:id", () => {  // Test for GET /api/v1/people/:id endpoint: retrieving a specific person entry
    it("should return the entry corresponding to the last person added.", (done) => { // Start the test for retrieving a specific person entry
      chai
        .request(app) // Send the request to the Express app
        .get(`/api/v1/people/${this.lastIndex}`) // Specify the endpoint URL with the dynamic index value
        .end((err, res) => { // Handle the response
          res.should.have.status(200); // Assert that the response has a status code of 200 (OK)
          console.log(res.body);
          res.body.name.should.be.eql("Scarlett"); // Assert that the response body has the expected name
          done(); // Complete the test
        });
    });
    it("should return an error if the index is >= the length of the array", (done) => { // Start the test for returning an error if the index is out of range
      chai
      .request(app) // Send the request to the Express app
      .get("/api/v1/people/43") // Specify an invalid endpoint URL with an out-of-range index
      .end((err, res) => { // Handle the response
        res.should.have.status(404); // Assert that the response has a status code of 404 (Not Found)
        done(); // Complete the test
      });
    });
  });
});
