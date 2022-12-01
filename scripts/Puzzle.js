import Algorithm from "./Algorithm.js";

let Direction = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    UP: "UP",
    DOWN: "DOWN"
};

export default class Puzzle {
    constructor(dimension, solve_func) {
        this.board = Array(dimension).fill().map(() => Array(dimension).fill());
        this.path = [];
        this.dimension = dimension;
        this.solve_func = solve_func;
        this.lastMove = null;
    }
    // Get the (x, y) position of the blank space
    getBlankSpacePosition = function () {
        let index = this.board.flat().indexOf(0);
        return [Math.floor(index / this.dimension), index % this.dimension];
    };
    // Swap two items on a bidimensional array
    swap = function (i1, j1, i2, j2) {
        [this.board[i1][j1], this.board[i2][j2]] = [this.board[i2][j2], this.board[i1][j1]];
    }
    // Return the direction that a piece can be moved, if any
    getMove = function (piece) {
        let [line, column] = this.getBlankSpacePosition();
        if (line > 0 && piece === this.board[line - 1][column]) {
            return Direction.DOWN;
        } else if (line < this.dimension - 1 && piece === this.board[line + 1][column]) {
            return Direction.UP;
        } else if (column > 0 && piece === this.board[line][column - 1]) {
            return Direction.RIGHT;
        } else if (column < this.dimension - 1 && piece === this.board[line][column + 1]) {
            return Direction.LEFT;
        }
    };
    // Move a piece, if possible, and return the direction that it was moved
    move = function (piece) {
        let move = this.getMove(piece);
        if (move) {
            let [line, column] = this.getBlankSpacePosition();
            let map = { "LEFT": { x: 0, y: 1 }, "RIGHT": { x: 0, y: -1 }, "UP": { x: 1, y: 0 }, "DOWN": { x: -1, y: 0 } };
            let { x, y } = map[move];
            this.swap(line, column, line + x, column + y);
            this.lastMove = piece;
            return move;
        }
    };
    isGoalState = function () {
        let array = this.board.flat();
        let lastIndex = array.length - 1;
        return array.every((n, i) => i !== lastIndex ? n === i + 1 : n === 0);
    };
    // Return a copy of current puzzle
    getCopy = function () {
        let newPuzzle = new Puzzle(this.dimension);
        newPuzzle.board = JSON.parse(JSON.stringify(this.board));
        this.path.forEach(p => newPuzzle.path.push(p));
        return newPuzzle;
    };
    // Return all current allowed moves
    getAllowedMoves = function () {
        return this.board.flat().filter(piece => this.getMove(piece));
    };
    visit = function () {
        let children = [];
        let allowedMoves = this.getAllowedMoves();
        for (let move of allowedMoves) {
            if (move !== this.lastMove) {
                let newInstance = this.getCopy();
                newInstance.move(move);
                newInstance.path.push(move);
                children.push(newInstance);
            }
        }
        return children;
    };
    solveBFS = function () {
        let startingState = this.getCopy();
        startingState.path = [];
        let states = [startingState];
        while (states.length > 0) {
            let state = states[0];
            states.shift();
            if (state.isGoalState()) {
                return state.path;
            }
            states = states.concat(state.visit());
        }
    };
    g = function () {
        return this.path.length;
    };
    getManhattanDistance = function () {
        let row = v => Math.floor(v / this.dimension);
        let col = v => v % this.dimension;
        return this.board.flat().map((piece, i) => piece !== 0 ? Math.abs(row(i) - row(piece - 1)) + Math.abs(col(i) - col(piece - 1)) : 0).reduce((a, b) => a + b, 0);
    };
    countMisplaced = function () {
        return this.board.flat().filter((piece, i) => piece !== 0 && piece !== i + 1).length;
    }
    h = function () {
        return this.solve_func === Algorithm.AMisplaced ? this.countMisplaced() : this.getManhattanDistance();
    };
    solveA = function () {
        let states = [];
        this.path = [];
        states.push({ puzzle: this, distance: 0 });
        while (states.length > 0) {
            let state = states.shift().puzzle;
            if (state.isGoalState()) {
                return state.path;
            }
            let children = state.visit();
            for (let child of children) {
                let f = child.g() + child.h();
                states.push({ puzzle: child, distance: f });
                states.sort((a, b) => a.distance - b.distance);
            }
        }
    };
    solve = function () {
        return this.solve_func === Algorithm.BFS ? this.solveBFS() : this.solveA();
    };
};

// let p = new Puzzle(3, Algorithm.AManhattan);
// p.board = [[1, 0, 3], [5, 2, 6], [4, 7, 8]];
// console.table(p.board);
// let r = p.solve();
// console.log(r);
