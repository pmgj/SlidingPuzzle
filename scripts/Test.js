import Cell from "./Cell.js";
import SlidingPuzzle from "./SlidingPuzzle.js";
import Algorithm from "./Algorithm.js";
import Puzzle from "./Puzzle.js";

function test1() {
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
}
function test2() {
    let algorithms = [Algorithm.AManhattan, Algorithm.BFS, Algorithm.AMisplaced];
    for(let alg of algorithms) {
        let p = new Puzzle([[7, 5, 8], [2, 4, 1], [3, 6, 0]], alg);
        let start = Date.now();
        let r = p.solve();
        let end = Date.now();
        let elapsed = end - start;
        console.log(`${alg} (${elapsed/1000}s): ${r}`);
    }
}
test1();
test2();