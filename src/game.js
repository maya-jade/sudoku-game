(function(){
  const boardEl = document.getElementById('board');
  const newBtn = document.getElementById('new-game');
  const resetBtn = document.getElementById('reset');
  const diffSel = document.getElementById('difficulty');
  const msgEl = document.getElementById('message');

  let puzzle = null;     // base puzzle numbers (immutable)
  let userGrid = null;   // user's current grid

  function renderGrid(){
    boardEl.innerHTML = '';
    for(let r=0; r<9; r++){
      const rowFrag = document.createDocumentFragment();
      for(let c=0; c<9; c++){
        const i = Sudoku.idx(r,c);
        const v = puzzle[i];
        const cell = document.createElement('div');
        cell.className = 'cell';
        if(v){
          cell.classList.add('prefilled');
          cell.textContent = String(v);
          userGrid[i] = v;
        } else {
          const input = document.createElement('input');
          input.setAttribute('inputmode','numeric');
          input.setAttribute('pattern','[1-9]');
          input.maxLength = 1;
          input.value = userGrid[i] ? String(userGrid[i]) : '';
          input.addEventListener('input', (e) => {
            const val = e.target.value.replace(/[^1-9]/g,'');
            e.target.value = val;
            userGrid[i] = val ? parseInt(val,10) : 0;
            validateAndUpdate();
          });
          cell.appendChild(input);
        }
        rowFrag.appendChild(cell);
      }
      const rowWrap = document.createElement('div');
      rowWrap.className = (r===2||r===5) ? 'row-'+(r+1) : '';
      rowWrap.appendChild(rowFrag);
      // unwrap to keep grid layout flat
      while(rowWrap.firstChild){ boardEl.appendChild(rowWrap.firstChild); }
    }
  }

  function validateAndUpdate(){
    // Clear all invalid styles first
    Array.from(boardEl.children).forEach(cell => cell.classList.remove('invalid'));

    const res = Sudoku.validateUserGrid(userGrid.slice());
    if(!res.ok){
      const i = Sudoku.idx(res.row, res.col);
      boardEl.children[i].classList.add('invalid');
      msgEl.textContent = 'There\'s a conflict.';
      return;
    }

    msgEl.textContent = '';
    if(Sudoku.isComplete(userGrid)){
      // Also confirm solved by solver
      const solved = Sudoku.solve(puzzle.slice());
      if(solved && solved.every((v, i) => v === userGrid[i])){
        msgEl.textContent = 'Solved! Great job!';
      }
    }
  }

  function newGame(){
    puzzle = Sudoku.generatePuzzle(diffSel.value);
    userGrid = new Array(81).fill(0);
    renderGrid();
    msgEl.textContent = '';
  }

  newBtn.addEventListener('click', newGame);
  resetBtn.addEventListener('click', () => { userGrid = puzzle.slice(); renderGrid(); msgEl.textContent=''; });
  diffSel.addEventListener('change', newGame);

  // Initial load
  newGame();
})();
