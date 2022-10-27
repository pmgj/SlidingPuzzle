import Cell from "./Cell.js";
import SlidingPuzzle from "./SlidingPuzzle.js";

let p = new SlidingPuzzle(3);
p.board = [[5, 8, 7], [2, 6, 1], [4, 3, 0]];
try {
    p.move(new Cell(0, 0));
    p.move(undefined, new Cell(0, 0));
    p.move(null, new Cell(0, 0));
    p.move(new Cell(0, 0), new Cell(0, 0));
    p.move(new Cell(-1, 0), new Cell(2, 2));
    p.move(new Cell(0, -1), new Cell(2, 2));
    p.move(new Cell(3, 0), new Cell(2, 2));
    p.move(new Cell(1, 3), new Cell(2, 2));
    console.error();
} catch (ex) {
}
p.move(new Cell(2, 1), new Cell(2, 2));
p.move(new Cell(1, 1), new Cell(2, 1));
p.move(new Cell(1, 2), new Cell(1, 1));
p.move(new Cell(0, 2), new Cell(1, 2));
console.table(p.board);