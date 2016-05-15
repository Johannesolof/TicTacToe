window.onload = function () {
    let theBoard: GameBoard = new GameBoard(3, 8, 8);
    document.getElementById('output').innerHTML = theBoard.draw();
    let currentPlayer: Piece = Piece.Circle;

    document.getElementsByName("input")[0].addEventListener('change', io);

    function io() {
        let input = toPos(this.value);
        if (input[0] == -1 || input[1] == -1)
            console.log(this.value + ' is not a valid move!');
        else {
            if (theBoard.setPiece(currentPlayer, input)) {
                currentPlayer = currentPlayer == Piece.Circle ? Piece.Cross : Piece.Circle;
            }
            else
                console.log("Already occupied!");

            let winner: [boolean, Piece] = theBoard.checkWin();
            if (winner[0]) {
                console.log("Winner is " + Piece[winner[1]]);
                theBoard = new GameBoard(3, 3, 3);
            }
            document.getElementById('output').innerHTML = theBoard.draw();
        }
    }
}

function toPos(s: string): [number, number] {
    let arr = s.split('');
    if (arr.length > 2)
        return [-1, -1];
    let pos: [number, number] = [-1, -1];

    pos[0] = arr[1].charCodeAt(0) - "1".charCodeAt(0);
    pos[1] = arr[0].charCodeAt(0) >= "a".charCodeAt(0) ? arr[0].charCodeAt(0) - "a".charCodeAt(0) : arr[0].charCodeAt(0) - "A".charCodeAt(0);

    return pos;
}

/**
 * Board
 */
enum Piece { Free, Cross, Circle };
class GameBoard {

    private _board: Piece[][];
    private _lastMove: [number, number];
    private _lastPlayer: Piece;
    private _size: [number, number];
    private _winCount: number;
    private _moveCount: number;

    constructor(winCount: number, sizeX: number, sizeY?: number) {
        this._winCount = winCount;
        this._size = [sizeX, sizeY || sizeX];
        this._board = [];
        this._moveCount = 0;

        for (let i: number = 0; i < this._size[0]; i++) {
            this._board[i] = [];
            for (let j: number = 0; j < this._size[1]; j++) {
                this._board[i][j] = Piece.Free;
            }
        }
    }

    setPiece(piece: Piece, pos: [number, number]): boolean {
        if (this._board[pos[0]][pos[1]] != Piece.Free)
            return false;
        this._board[pos[0]][pos[1]] = piece;
        this._lastMove = pos;
        this._lastPlayer = piece;
        this._moveCount += 1;
        return true;
    }

    getPiece(pos: [number, number]): Piece {
        return this._board[pos[0]][pos[1]];
    }

    get(): Piece[][] {
        return this._board;
    }

    checkWin(): [boolean, Piece] {
        if (this._moveCount >= this._size[0] * this._size[1])
            return [true, Piece.Free];
        if (!this._lastMove) return [false, Piece.Free];

        let horizontal: number = 1;
        let vertical: number = 1;
        let diagonal: number = 1;
        let antidiagonal: number = 1;

        for (var i = 1; i < this._winCount; i++) {

            if (this._lastMove[0] + i < this._size[0] &&
                this._board[this._lastMove[0] + i][this._lastMove[1]] == this._lastPlayer)
                horizontal += 1;

            if (this._lastMove[0] - i >= 0 &&
                this._board[this._lastMove[0] - i][this._lastMove[1]] == this._lastPlayer)
                horizontal += 1;

            if (this._lastMove[1] + i < this._size[1] &&
                this._board[this._lastMove[0]][this._lastMove[1] + i] == this._lastPlayer)
                vertical += 1;

            if (this._lastMove[1] - i >= 0 &&
                this._board[this._lastMove[0]][this._lastMove[1] - i] == this._lastPlayer)
                vertical += 1;

            if (this._lastMove[0] + i < this._size[0] &&
                this._lastMove[1] + i < this._size[1] &&
                this._board[this._lastMove[0] + i][this._lastMove[1] + i] == this._lastPlayer)
                diagonal += 1;

            if (this._lastMove[0] - i >= 0 &&
                this._lastMove[1] - i >= 0 &&
                this._board[this._lastMove[0] - i][this._lastMove[1] - i] == this._lastPlayer)
                diagonal += 1;

            if (this._lastMove[0] + i < this._size[0] &&
                this._lastMove[1] - i >= 0 &&
                this._board[this._lastMove[0] + i][this._lastMove[1] - i] == this._lastPlayer)
                antidiagonal += 1;

            if (this._lastMove[0] - i >= 0 &&
                this._lastMove[1] + i < this._size[1] &&
                this._board[this._lastMove[0] - i][this._lastMove[1] + i] == this._lastPlayer)
                antidiagonal += 1;

            if (horizontal == this._winCount || vertical == this._winCount || diagonal == this._winCount || antidiagonal == this._winCount)
                return [true, this._lastPlayer];
        }
        return [false, Piece.Free];
    }

    pieceToChar(p: Piece): string {
        return [' ', 'x', 'o'][p];
    }

    draw(): string {
        let b: string[][] = new Array();

        for (let i: number = 0; i < this._size[0]; i++) {
            b.push(new Array());
            b.push(new Array());
            if (i == this._size[0] - 1) b.push(new Array());
            for (let j: number = 0; j < this._size[1]; j++) {

                if (i == 0 && j == 0) { // Top left
                    b[i * 2].push(`   &#9487;&#9473;&#9473;&#9473;`);
                    b[i * 2 + 1].push(` ${i + 1} &#9475; ${this.pieceToChar(this._board[i][j])} `);
                }
                else if (i == 0 && j != this._size[1] - 1) { // Top center
                    b[i * 2].push(`&#9523;&#9473;&#9473;&#9473;`);
                    b[i * 2 + 1].push(`&#9475; ${this.pieceToChar(this._board[i][j])} `);
                }
                else if (i == 0 && j == this._size[1] - 1) { // Top right
                    b[i * 2].push(`&#9523;&#9473;&#9473;&#9473;&#9491;`);
                    b[i * 2 + 1].push(`&#9475; ${this.pieceToChar(this._board[i][j])} &#9475;`);
                }
                else if (i != this._size[0] - 1 && j == 0) { // Mid left
                    b[i * 2].push(`   &#9507;&#9473;&#9473;&#9473;`);
                    b[i * 2 + 1].push(` ${i + 1} &#9475; ${this.pieceToChar(this._board[i][j])} `);
                }
                else if (i != this._size[0] - 1 && j != this._size[1] - 1) { // Mid center
                    b[i * 2].push(`&#9547;&#9473;&#9473;&#9473;`);
                    b[i * 2 + 1].push(`&#9475; ${this.pieceToChar(this._board[i][j])} `);
                }
                else if (i != this._size[0] - 1 && j == this._size[1] - 1) { // Mid right
                    b[i * 2].push(`&#9547;&#9473;&#9473;&#9473;&#9515;`);
                    b[i * 2 + 1].push(`&#9475; ${this.pieceToChar(this._board[i][j])} &#9475;`);
                }
                else if (i == this._size[0] - 1 && j == 0) { // Bot left
                    b[i * 2].push(`   &#9507;&#9473;&#9473;&#9473;`);
                    b[i * 2 + 1].push(` ${i + 1} &#9475; ${this.pieceToChar(this._board[i][j])} `);
                    b[i * 2 + 2].push(`   &#9495;&#9473;&#9473;&#9473;`);
                }
                else if (i == this._size[0] - 1 && j != this._size[1] - 1) { // Bot center
                    b[i * 2].push(`&#9547;&#9473;&#9473;&#9473;`);
                    b[i * 2 + 1].push(`&#9475; ${this.pieceToChar(this._board[i][j])} `);
                    b[i * 2 + 2].push(`&#9531;&#9473;&#9473;&#9473;`);
                }
                else if (i == this._size[0] - 1 && j == this._size[1] - 1) { // Bot right
                    b[i * 2].push(`&#9547;&#9473;&#9473;&#9473;&#9515;`);
                    b[i * 2 + 1].push(`&#9475; ${this.pieceToChar(this._board[i][j])} &#9475;`);
                    b[i * 2 + 2].push(`&#9531;&#9473;&#9473;&#9473;&#9499;`);
                }
            }
        }
        let firstRow: string = '  ';

        for (let j: number = 0; j < this._size[1]; j++) {
            firstRow += `   ${String.fromCharCode(j + 'A'.charCodeAt(0))}`;
        }

        b.unshift([firstRow]);

        let result: string[] = new Array();
        b.forEach(sArr => result.push(sArr.join('')));
        console.log(result.join('\n'));
        return result.join('\n');


        //     if (i == 0) b += '&#9523;&#9473;&#9473;&#9473;&#9491;\n';
        //     else b += '&#9547;&#9473;&#9473;&#9473;&#9547;&#9473;&#9473;&#9473;&#9515;\n';
        //     for (let j: number = 0; j < 3; j++) {
        //         if (j == 0) b += ' ' + (i + 1) + ' &#9475;';
        //         else b += '&#9475;'
        //         switch (this._board[i][j]) {
        //             case Piece.Free:
        //                 b += '   ';
        //                 break;

        //             case Piece.Cross:
        //                 b += ' x ';
        //                 break;

        //             case Piece.Circle:
        //                 b += ' &#9675; ';
        //                 break;

        //             default:
        //                 break;
        //         }
        //         b += '';
        //     }
        //     b += '&#9475;\n';
        // }
        // b += '&#9531;&#9473;&#9473;&#9473;&#9531;&#9473;&#9473;&#9473;&#9499;\n';
        // return b;
    }
}
