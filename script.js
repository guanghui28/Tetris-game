/** CONSTANT */
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLOR_MAPPING = [
    "red",
    "orange",
    "green",
    "purple",
    "blue",
    "cyan",
    "yellow",
    "white",
];

const WHITE_COLOR_ID = 7;
const BRICK_LAYOUT = [
    [
        [
            [1, 7, 7],
            [1, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 1, 1],
            [7, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [7, 7, 1],
        ],
        [
            [7, 1, 7],
            [7, 1, 7],
            [1, 1, 7],
        ],
    ],
    [
        [
            [7, 1, 7],
            [7, 1, 7],
            [7, 1, 1],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [1, 7, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 7, 1],
            [1, 1, 1],
            [7, 7, 7],
        ],
    ],
    [
        [
            [1, 7, 7],
            [1, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 1, 1],
            [1, 1, 7],
            [7, 7, 7],
        ],
        [
            [7, 1, 7],
            [7, 1, 1],
            [7, 7, 1],
        ],
        [
            [7, 7, 7],
            [7, 1, 1],
            [1, 1, 7],
        ],
    ],
    [
        [
            [7, 1, 7],
            [1, 1, 7],
            [1, 7, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 7, 1],
            [7, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 7],
            [7, 1, 1],
        ],
    ],
    [
        [
            [7, 7, 7, 7],
            [1, 1, 1, 1],
            [7, 7, 7, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 1, 7],
            [7, 7, 1, 7],
            [7, 7, 1, 7],
            [7, 7, 1, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 7, 7, 7],
            [1, 1, 1, 1],
            [7, 7, 7, 7],
        ],
        [
            [7, 1, 7, 7],
            [7, 1, 7, 7],
            [7, 1, 7, 7],
            [7, 1, 7, 7],
        ],
    ],
    [
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
    ],
    [
        [
            [7, 1, 7],
            [1, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 1, 7],
            [7, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 1, 7],
            [1, 1, 7],
            [7, 1, 7],
        ],
    ],
];

const KEY_CODES = {
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    UP: "ArrowUp",
    DOWN: "ArrowDown",
};

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.generateWhiteBoard();
        this.score = 0;
        this.gameOver = false;
        this.isPlaying = false;
        this.clearAudio = new Audio("./sounds/clear.wav");
    }

    reset() {
        document.getElementById("score").textContent = 0;
        this.isPlaying = true;
        this.grid = this.generateWhiteBoard();
        this.score = 0;
        this.gameOver = false;
        this.drawBoard();
    }

    generateWhiteBoard() {
        // board game is the matrix whose have 20 rows x 10 cols -> begin fill all white blocks
        return Array.from({ length: ROWS }, () =>
            Array(COLS).fill(WHITE_COLOR_ID)
        );
    }

    drawCell(x, y, colorId) {
        this.ctx.fillStyle =
            COLOR_MAPPING[colorId] || COLOR_MAPPING[WHITE_COLOR_ID];
        this.ctx.fillRect(
            x * BLOCK_SIZE,
            y * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
        );
        this.ctx.fillStyle = "black";
        this.ctx.strokeRect(
            x * BLOCK_SIZE,
            y * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
        );
    }

    drawBoard() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                this.drawCell(col, row, this.grid[row][col]);
            }
        }
    }

    handleCompleteRows() {
        const latestGrid = this.grid.filter((row) =>
            row.some((col) => col === WHITE_COLOR_ID)
        );

        const newScore = ROWS - latestGrid.length;
        const newRows = Array.from({ length: newScore }, () =>
            Array(COLS).fill(WHITE_COLOR_ID)
        );
        if (newScore) {
            this.clearAudio.play();
            this.grid = [...newRows, ...latestGrid];
            this.handleScore(newScore * 10);
        }
    }

    handleScore(newScore) {
        this.score += newScore;
        document.getElementById("score").textContent = this.score;
    }

    handleGameOver() {
        this.gameOver = true;
        alert("GAME OVER!");
    }
}

class Brick {
    constructor(id) {
        // id is the index of brick layout (7 difference shape)
        this.id = id;
        // each layout has 4 shape when use keyboard arrow rotate (normal, right, bellow, right)
        this.layout = BRICK_LAYOUT[this.id];
        // What shape is it displayed now?
        this.activeIndex = 0;
        // it's currently position
        this.colPos = 3;
        this.rowPos = 0;
    }

    draw() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (
                let col = 0;
                col < this.layout[this.activeIndex][0].length;
                col++
            ) {
                if (
                    this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID
                ) {
                    board.drawCell(
                        col + this.colPos,
                        row + this.rowPos,
                        this.id
                    );
                }
            }
        }
    }

    // clear before move to create movement
    clear() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (
                let col = 0;
                col < this.layout[this.activeIndex][0].length;
                col++
            ) {
                if (
                    this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID
                ) {
                    board.drawCell(
                        col + this.colPos,
                        row + this.rowPos,
                        WHITE_COLOR_ID
                    );
                }
            }
        }
    }

    moveLeft() {
        if (
            !this.checkCollision(
                this.rowPos,
                this.colPos - 1,
                this.layout[this.activeIndex]
            )
        ) {
            this.clear();
            this.colPos--;
            this.draw();
        }
    }

    moveRight() {
        if (
            !this.checkCollision(
                this.rowPos,
                this.colPos + 1,
                this.layout[this.activeIndex]
            )
        ) {
            this.clear();
            this.colPos++;
            this.draw();
        }
    }

    moveDown() {
        if (
            !this.checkCollision(
                this.rowPos + 1,
                this.colPos,
                this.layout[this.activeIndex]
            )
        ) {
            this.clear();
            this.rowPos++;
            this.draw();
            return;
        }

        this.handleLanded();
        generateNewBrick();
    }

    // press up arrow
    rotate() {
        if (
            !this.checkCollision(
                this.rowPos,
                this.colPos,
                this.layout[(this.activeIndex + 1) % 4]
            )
        ) {
            this.clear();
            this.activeIndex = (this.activeIndex + 1) % 4;
            this.draw();
            /**
             * activeIndex = 0
             * 0 + 1 = 1 % 4 = 1
             * ...
             * 3 + 1 = 4 % 4= = 0 (back again)
             */
        }
    }

    checkCollision(nextRow, nextCol, nextLayout) {
        for (let row = 0; row < nextLayout.length; row++) {
            for (let col = 0; col < nextLayout[0].length; col++) {
                if (nextLayout[row][col] !== WHITE_COLOR_ID) {
                    if (
                        col + nextCol < 0 ||
                        col + nextCol >= COLS ||
                        row + nextRow >= ROWS ||
                        board.grid[row + nextRow][col + nextCol] !==
                            WHITE_COLOR_ID
                    )
                        return true;
                }
            }
        }
        return false;
    }

    // when a brick landed, generate a new brick
    handleLanded() {
        if (this.rowPos <= 0) {
            board.handleGameOver();
            return;
        }
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (
                let col = 0;
                col < this.layout[this.activeIndex][0].length;
                col++
            ) {
                if (
                    this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID
                ) {
                    board.grid[row + this.rowPos][col + this.colPos] = this.id;
                }
            }
        }
        board.handleCompleteRows();
        board.drawBoard();
    }
}

let brick;

const generateNewBrick = () => {
    brick = new Brick(Math.floor(Math.random() * BRICK_LAYOUT.length));
    brick.draw();
};

const board = new Board(ctx);
board.drawBoard();

document.getElementById("play-btn").addEventListener("click", () => {
    board.reset();
    generateNewBrick();
    const refresh = setInterval(() => {
        if (!board.gameOver) {
            brick.moveDown();
        } else {
            clearInterval(refresh);
        }
    }, 1000);
});

document.addEventListener("keydown", (event) => {
    if (!board.gameOver && board.isPlaying) {
        switch (event.code) {
            // 4 case: "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"
            case KEY_CODES.LEFT:
                brick.moveLeft();
                break;
            case KEY_CODES.RIGHT:
                brick.moveRight();
                break;
            case KEY_CODES.DOWN:
                brick.moveDown();
                break;
            case KEY_CODES.UP:
                brick.rotate();
                break;
            default:
                break;
        }
    }
});
