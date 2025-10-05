// Simple Sudoku logic with preset puzzles for three difficulties
(function(global){
  const PUZZLES = {
    easy: [
      // 0 denotes empty
      "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
      "006000290900050006700200000300002600000037000008400002000009003500060008079000500"
    ],
    medium: [
      "000260701680070090190004500820100040004602900050003028009300074040050036703018000",
      "100000000609030000030705040000000006006000500500000000040207050000050907000000002"
    ],
    hard: [
      "005300000800000020070010500400005300010070006003200080060500009004000000000000000",
      "000000907000420180000705026100904000050000040000507009920108000034059000507000000"
    ]
  };

  function parseGrid(str){
    return str.split("").map(ch => parseInt(ch,10) || 0);
  }
  function clone(arr){ return arr.slice(); }

  function idx(r,c){ return r*9+c; }

  function isValid(grid, r, c, val){
    for(let i=0;i<9;i++){
      if(grid[idx(r,i)]===val) return false;
      if(grid[idx(i,c)]===val) return false;
    }
    const br = Math.floor(r/3)*3;
    const bc = Math.floor(c/3)*3;
    for(let rr=0; rr<3; rr++){
      for(let cc=0; cc<3; cc++){
        if(grid[idx(br+rr, bc+cc)]===val) return false;
      }
    }
    return true;
  }

  function solve(grid){
    // Backtracking solver; returns a solved grid or null
    const pos = findEmpty(grid);
    if(!pos) return grid;
    const [r,c] = pos;
    for(let v=1; v<=9; v++){
      if(isValid(grid,r,c,v)){
        grid[idx(r,c)] = v;
        const solved = solve(grid);
        if(solved) return solved;
        grid[idx(r,c)] = 0;
      }
    }
    return null;
  }

  function findEmpty(grid){
    for(let i=0;i<81;i++) if(grid[i]===0) return [Math.floor(i/9), i%9];
    return null;
  }

  function generatePuzzle(difficulty){
    const list = PUZZLES[difficulty] || PUZZLES.easy;
    const str = list[Math.floor(Math.random()*list.length)];
    return parseGrid(str);
  }

  function formatGrid(grid){
    return grid.map(v => v||".").join("");
  }

  function isComplete(grid){
    return grid.every(v => v>=1 && v<=9);
  }

  function validateUserGrid(userGrid){
    // Quick validation: each non-zero must not violate Sudoku constraints
    for(let r=0;r<9;r++){
      for(let c=0;c<9;c++){
        const v = userGrid[idx(r,c)];
        if(v===0) continue;
        // Temporarily clear and recheck
        userGrid[idx(r,c)] = 0;
        if(!isValid(userGrid, r, c, v)){
          userGrid[idx(r,c)] = v; // restore
          return { ok:false, row:r, col:c };
        }
        userGrid[idx(r,c)] = v;
      }
    }
    return { ok:true };
  }

  global.Sudoku = {
    idx,
    generatePuzzle,
    solve: (grid) => solve(clone(grid)),
    isValid,
    isComplete,
    validateUserGrid,
    formatGrid
  };
})(window);
