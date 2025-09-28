"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { coordinate, puzzle, value } = req.body;
    const regexValidPuzzle = /^[0-9.]+$/;
    const regexValidCoordinate = /^[a-iA-I][1-9]$/;
    const regexValidValue = /^[1-9]$/;

    // check missing field
    if (!coordinate || !value || !puzzle) {
      return res.json({ error: "Required field(s) missing" });
    }

    // check valid puzzle
    if (!regexValidPuzzle.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    // check length of puzzle is 81 characters
    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    const row = coordinate[0].toUpperCase().charCodeAt(0) - 65; // 'A' = 0
    const col = parseInt(coordinate[1]) - 1;

    const currentVal = puzzle[row * 9 + col];

    // Trường hợp đặc biệt: giá trị nhập trùng với giá trị sẵn có
    if (currentVal === value) {
      return res.json({ valid: true });
    }

    // check valid value
    if (!regexValidValue.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    // check valid coordinate
    if (!regexValidCoordinate.test(coordinate)) {
      return res.json({ error: "Invalid coordinate" });
    }

    const conflict = [];

    const isExistRow = solver.checkRowPlacement(
      puzzle,
      coordinate[0].toUpperCase(),
      coordinate[1],
      value
    );
    if (isExistRow) {
      conflict.push("row");
    }

    const isExistCol = solver.checkColPlacement(
      puzzle,
      coordinate[0].toUpperCase(),
      coordinate[1],
      value
    );
    if (isExistCol) {
      conflict.push("column");
    }

    const isExistRegion = solver.checkRegionPlacement(
      puzzle,
      coordinate[0].toUpperCase(),
      coordinate[1],
      value
    );
    if (isExistRegion) {
      conflict.push("region");
    }

    if (conflict.length) {
      return res.json({ valid: false, conflict });
    }

    return res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }

    const regexValidPuzzle = /^[0-9.]+$/;
    // check valid puzzle
    if (!regexValidPuzzle.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    // check length of puzzle is 81 characters
    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }

    const isSolver = solver.solve(puzzle);
    console.log("isSolver", isSolver);

    if (!isSolver) {
      return res.json({ error: "Puzzle cannot be solved" });
    }

    return res.json({ solution: isSolver });
  });
};
