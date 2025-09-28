class SudokuSolver {
  validate(puzzleString) {
    const regex = /^[0-9.]+$/;
    return regex.test(puzzleString) && puzzleString.length === 81;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const valuesIndexOfRow = {
      A: [0, 9],
      B: [10, 18],
      C: [19, 27],
      D: [28, 36],
      E: [37, 45],
      F: [46, 54],
      G: [55, 63],
      H: [64, 72],
      I: [73, 81],
    };

    const valuesStringOfRow = puzzleString?.slice(...valuesIndexOfRow[row]);

    const valuesStringOfRowWithoutValueColumn =
      valuesStringOfRow?.slice(0, column - 1) +
      valuesStringOfRow?.slice(column);

    const isExistValueInRow = (
      valuesStringOfRowWithoutValueColumn || []
    )?.includes(value);

    return isExistValueInRow;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const columnInt = +column;

    const valueColumn1 = puzzleString?.slice(columnInt - 1, columnInt - 0);
    const valueColumn2 = puzzleString?.slice(columnInt + 8, columnInt + 9);
    const valueColumn3 = puzzleString?.slice(columnInt + 17, columnInt + 18);
    const valueColumn4 = puzzleString?.slice(columnInt + 26, columnInt + 27);
    const valueColumn5 = puzzleString?.slice(columnInt + 35, columnInt + 36);
    const valueColumn6 = puzzleString?.slice(columnInt + 44, columnInt + 45);
    const valueColumn7 = puzzleString?.slice(columnInt + 53, columnInt + 54);
    const valueColumn8 = puzzleString?.slice(columnInt + 62, columnInt + 63);
    const valueColumn9 = puzzleString?.slice(columnInt + 71, columnInt + 72);

    const valuesStringOfCol =
      valueColumn1 +
      valueColumn2 +
      valueColumn3 +
      valueColumn4 +
      valueColumn5 +
      valueColumn6 +
      valueColumn7 +
      valueColumn8 +
      valueColumn9;

    if (!valuesStringOfCol) {
      return false;
    }

    const rowToIndex = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
    };

    const valuesStringOfColWithoutValueRow =
      valuesStringOfCol?.slice(0, rowToIndex[row]) +
      valuesStringOfCol?.slice(+rowToIndex[row] + 1);
    const isExistValueInCol = valuesStringOfColWithoutValueRow?.includes(value);

    return isExistValueInCol;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rows = "ABCDEFGHI";
    const cols = "123456789";
    const places = [];
    for (const r of rows) {
      for (const c of cols) {
        places.push(r + c);
      }
    }

    const placesMap = {};

    places.forEach((places, index) => {
      placesMap[places] = index;
    });

    const currentPlace = row + column;

    const regions = {
      regions1: ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"],
      regions2: ["A4", "A5", "A6", "B4", "B5", "B6", "C4", "C5", "C6"],
      regions3: ["A7", "A8", "A9", "B7", "B8", "B9", "C7", "C8", "C9"],
      regions4: ["D1", "D2", "D3", "E1", "E2", "E3", "F1", "F2", "F3"],
      regions5: ["D4", "D5", "D6", "E4", "E5", "E6", "F4", "F5", "F6"],
      regions6: ["D7", "D8", "D9", "E7", "E8", "E9", "F7", "F8", "F9"],
      regions7: ["G1", "G2", "G3", "H1", "H2", "H3", "I1", "I2", "I3"],
      regions8: ["G4", "G5", "G6", "H4", "H5", "H6", "I4", "I5", "I6"],
      regions9: ["G7", "G8", "G9", "H7", "H8", "H9", "I7", "I8", "I9"],
    };

    let currentRegion;

    for (const region in regions) {
      if (regions[region]?.includes(currentPlace)) {
        currentRegion = regions[region];
      }
    }

    let isExistValueInRegion = false;

    for (let index = 0; index < currentRegion.length; index++) {
      if (currentRegion[index] === currentPlace) {
        continue;
      }

      const indexOfPlace = placesMap[currentRegion[index]];

      if (puzzleString?.[indexOfPlace] === value) {
        isExistValueInRegion = true;
        break;
      }
    }

    return isExistValueInRegion;
  }

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
