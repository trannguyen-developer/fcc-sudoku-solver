const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  const validPuzzleString =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const inValidPuzzleString =
    "..1..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  suite("POST request to /api/solve", function () {
    test("Solve a puzzle with valid puzzle string", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({
          puzzle: validPuzzleString,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "solution");
          assert.equal(
            res.body.solution,
            "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
          );
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Solve a puzzle with invalid characters", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9...H.6.62.71...9......1945....4.37.4.3..6..",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Solve a puzzle with incorrect length", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: inValidPuzzleString + "333" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Solve a puzzle that cannot be solved", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: inValidPuzzleString })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST request to /api/check", function () {
    test("Check a puzzle placement with all fields", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: inValidPuzzleString, coordinate: "A5", value: "3" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: inValidPuzzleString, coordinate: "A1", value: "3" })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, "valid");
          assert.property(res.body, "conflict");

          assert.equal(res.body.valid, false);
          assert.deepEqual(res.body.conflict, ["region"]);
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: inValidPuzzleString, coordinate: "A1", value: "5" })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, "valid");
          assert.property(res.body, "conflict");

          assert.equal(res.body.valid, false);
          assert.include(res.body.conflict, "row");
          assert.include(res.body.conflict, "column");
          assert.include(res.body.conflict, "region");
          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: inValidPuzzleString, coordinate: "A1", value: "5" })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, "valid");
          assert.property(res.body, "conflict");

          assert.equal(res.body.valid, false);
          assert.include(res.body.conflict, "row");
          assert.include(res.body.conflict, "column");
          assert.include(res.body.conflict, "region");
          done();
        });
    });

    test("Check a puzzle placement with missing required fields", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: inValidPuzzleString, coordinate: "A1" })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, "error");

          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Check a puzzle placement with invalid characters", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: inValidPuzzleString, coordinate: "A1", value: "E" })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, "error");

          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });

    test("Check a puzzle placement with incorrect length", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: inValidPuzzleString + "11",
          coordinate: "A1",
          value: "E",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, "error");

          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: inValidPuzzleString,
          coordinate: "A11",
          value: "3",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, "error");

          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: inValidPuzzleString,
          coordinate: "A5",
          value: "3",
        })
        .end(function (err, res) {
          console.log("res", res.body);

          assert.equal(res.status, 200);

          assert.property(res.body, "valid");

          assert.equal(res.body.valid, true);
          done();
        });
    });
  });
});
