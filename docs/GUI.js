import Cell from "./Cell.js";
import End from "./End.js";
import SlidingPuzzle from "./SlidingPuzzle.js";

class GUI {
    constructor() {
        this.game = null;
    }
    registerEvents() {
        let size = document.getElementById("size");
        size.onchange = this.init.bind(this);
        let start = document.getElementById("start");
        start.onclick = this.init.bind(this);
        this.init();
    }
    init() {
        let size = document.getElementById("size");
        this.game = new SlidingPuzzle(parseInt(size.value));
        let tab = this.game.getBoard();
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < tab.length; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < tab[i].length; j++) {
                let td = document.createElement("td");
                if (tab[i][j] !== 0) {
                    let div = document.createElement("div");
                    div.textContent = tab[i][j];
                    div.ondragstart = this.drag.bind(this);
                    div.draggable = true;
                    td.appendChild(div);
                }
                td.onclick = this.play.bind(this);
                td.ondragover = this.allowDrop.bind(this);
                td.ondrop = this.drop.bind(this);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        this.setMessage("");
    }
    drag(ev) {
        ev.dataTransfer.setData("origin", JSON.stringify(this.coordinates(ev.currentTarget.parentNode)));
    }
    allowDrop(ev) {
        ev.preventDefault();
    }
    drop(ev) {
        ev.preventDefault();
        let bTableData = this.getTableData(JSON.parse(ev.dataTransfer.getData("origin")));
        this.innerPlay(bTableData, ev.currentTarget, false);
    }
    getTableData({ x, y }) {
        let table = document.querySelector("table");
        return table.rows[x].cells[y];
    }
    play(ev) {
        let bTableData = ev.currentTarget;
        let endCell = this.coordinates(bTableData);
        let emptyCell = this.game.getEmptyCell(endCell);
        if (emptyCell) {
            let eTableData = this.getTableData(emptyCell);
            this.innerPlay(bTableData, eTableData, true);
        }
    }
    innerPlay(bTableData, eTableData, animation) {
        let beginCell = this.coordinates(bTableData);
        let endCell = this.coordinates(eTableData);
        let image = bTableData.firstChild;
        try {
            let end = this.game.move(beginCell, endCell);
            let move = () => {
                eTableData.appendChild(image);
                this.changeMessage(end);
            };
            if (animation) {
                let { x: or, y: oc } = beginCell;
                let { x: dr, y: dc } = endCell;
                let anim = image.animate([{ top: 0, left: 0 }, { top: `${(dr - or) * 58}px`, left: `${(dc - oc) * 58}px` }], 500);
                anim.onfinish = move;
            } else {
                move();
            }
        } catch (ex) {
            this.setMessage(ex);
        }
    }
    setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    changeMessage(m) {
        if (m === End.NO) {
            this.setMessage("");
            return;
        }
        this.setMessage(`Game Over! You win.`);
        let numbers = document.querySelectorAll("td div");
        numbers.forEach(n => n.style.animationName = "gameover");
    }
    coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
}
let gui = new GUI();
gui.registerEvents();