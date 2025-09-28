const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  const puzzleString =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

  suite("Test controller validate puzzle string", function () {
    test("Validate invalid", function () {
      assert.equal(
        solver.validate("234H2343232.3423"),
        false,
        "Puzzle contain number and ."
      );
    });

    test("Puzzle string valid", function () {
      assert.equal(solver.validate(puzzleString), true);
    });
  });

  suite("Check row placement conflict", function () {
    test("Row placement conflict", function () {
      assert.equal(
        solver.checkRowPlacement(puzzleString, "A", 1, 9),
        true,
        "9 already exists in this row"
      );
    });

    test("Row placement is valid", function () {
      assert.equal(
        solver.checkRowPlacement(puzzleString, "A", 1, 7),
        false,
        "7 is valid"
      );
    });
  });

  suite("Check column placement conflict", function () {
    test("Column placement conflict", function () {
      assert.equal(
        solver.checkColPlacement(puzzleString, "A", 2, 9),
        true,
        "9 already exists in this column"
      );
    });

    test("Column placement is valid", function () {
      assert.equal(
        solver.checkColPlacement(puzzleString, "A", 2, 1),
        false,
        "1 is valid"
      );
    });
  });

  suite("Check region placement conflict", function () {
    test("Region placement conflict", function () {
      assert.equal(
        solver.checkRegionPlacement(puzzleString, "A", 2, 9),
        true,
        "9 already exists in this region"
      );
    });

    test("Region placement is valid", function () {
      assert.equal(
        solver.checkRegionPlacement(puzzleString, "A", 2, 1),
        false,
        "1 is valid"
      );
    });
  });

  suite("Resolve sudoku", function () {
    test("Sudoku question valid", function () {
      assert.equal(
        solver.solve(puzzleString),
        "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
      );
    });

    test("Region placement is invalid", function () {
      assert.equal(
        solver.solve(
          "..1..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        ),
        false
      );
    });

    test("Sudoku question valid", function () {
      assert.equal(
        solver.solve(
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
        ),
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
      );
    });

    test("Sudoku question valid", function () {
      assert.equal(
        solver.solve(
          "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3"
        ),
        "568913724342687519197254386685479231219538467734162895926345178473891652851726943"
      );
    });
  });
});
