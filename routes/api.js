"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { coordinate, puzzle, value } = req.body;
  });

  app.route("/api/solve").post((req, res) => {});
};
