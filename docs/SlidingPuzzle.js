import Cell from "./Cell.js";
import End from "./End.js";

export default class SlidingPuzzle {
    constructor(size) {
        if (size < 3) {
            throw new Error("Incorrect size.");
        }
        this.board = Array(size).fill().map(() => Array(size).fill());
        this.size = size;
        let num = 1;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                this.board[i][j] = num === size * size ? 0 : num++;
            }
        }
        this.shuffle();
    }
    shuffle() {
        let array = this.board.flat();
        let randomize = array => {
            let currentIndex = array.length, randomIndex;
            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }
        };
        let countInversions = array => {
            let emptyTile = 0;
            let numberInversions = 0;
            for (let i = 0; i < array.length - 1; i++) {
                if (array[i] === emptyTile)
                    continue;
                for (let j = i + 1; j < array.length; j++) {
                    if (array[i] > array[j] && array[j] !== emptyTile) {
                        numberInversions++;
                    }
                }
            }
            return numberInversions;
        };
        let isSlidePuzzleSolvable = (numberOfInversions, width, emptyTilePosition) => {
            let GetRowNumberFromBelow = (width, emptyTilePosition) => {
                return width - Math.floor(emptyTilePosition / width);
            };
            if (width % 2 !== 0)
                return numberOfInversions % 2 === 0;
            let rowNumber = GetRowNumberFromBelow(width, emptyTilePosition);
            return rowNumber % 2 !== 0 ? numberOfInversions % 2 === 0 : numberOfInversions % 2 !== 0;
        };
        let SwapTilesInSlidePuzzle = puzzle => {
            if (puzzle.length < 2)
                return;
            if (puzzle[0] != 0 && puzzle[1] != 0) {
                [puzzle[0], puzzle[1]] = [puzzle[1], puzzle[0]];
            } else {
                [puzzle[puzzle.length - 1], puzzle[puzzle.length - 2]] = [puzzle[puzzle.length - 2], puzzle[puzzle.length - 1]];
            }
        };
        randomize(array);
        let numberInversions = countInversions(array);
        console.log(isSlidePuzzleSolvable(numberInversions, this.size, array.indexOf(0)));
        if (!isSlidePuzzleSolvable(numberInversions, this.size, array.indexOf(0))) {
            SwapTilesInSlidePuzzle(array);
        }
        for (let i = 0; i < array.length; i++) {
            this.board[Math.floor(i / this.size)][Math.floor(i % this.size)] = array[i];
        }
    }
    move(beginCell, endCell) {
        let { x: or, y: oc } = beginCell;
        let { x: dr, y: dc } = endCell;
        if (!beginCell || !endCell) {
            throw new Error("The value of one of the cells does not exist.");
        }
        if (beginCell.equals(endCell)) {
            throw new Error("Origin and destination must be different.");
        }
        if (!this.onBoard(beginCell) || !this.onBoard(endCell)) {
            throw new Error("Origin or destination are not in the board.");
        }
        if (this.board[or][oc] === 0) {
            throw new Error("Origin does not have a piece.");
        }
        if (this.board[dr][dc] !== 0) {
            throw new Error("Destination must be empty.");
        }
        let moves = [new Cell(or + 1, oc), new Cell(or - 1, oc), new Cell(or, oc + 1), new Cell(or, oc - 1)];
        if (!moves.some(m => m.equals(endCell))) {
            throw new Error("Only orthogonal moves are allowed.");
        }
        this.board[dr][dc] = this.board[or][oc];
        this.board[or][oc] = 0;
        return this.endOfGame();
    }
    endOfGame() {
        let array = this.board.flat();
        let lastIndex = array.length - 1;
        let end = array.every((n, i) => i !== lastIndex ? n === i + 1 : n === 0);
        return end ? End.YES : End.NO;
    }
    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return (inLimit(x, this.size) && inLimit(y, this.size));
    }
    getBoard() {
        return this.board;
    }
    getEmptyCell(cell) {
        let { x, y } = cell;
        let cells = [new Cell(x - 1, y), new Cell(x + 1, y), new Cell(x, y - 1), new Cell(x, y + 1)];
        for (let c of cells) {
            let { x: row, y: col } = c;
            if (this.onBoard(c) && this.board[row][col] === 0) {
                return c;
            }
        }
        return null;
    }
}
