let ticTacToe = undefined;
let canvas = undefined;
let isComputersTurn = true;
let doOnce = false;
let playing = false;
let splash = undefined;
let context = undefined;
let firstSleep = 500;
let COMPUTER = 2;
let PLAYER = 1;
let EMPTY = 0;
let TIE = 3;
let maxSuccess = 0;
let winner = EMPTY;
let score_win = 0;
let score_tie = 0;
let score_loss = 0;
let hardDifficulty = true;

// Entry point
window.onload = function() 
{   
    canvas = document.querySelector("canvas");
    canvas.width = 500;
    canvas.height = 350;
    
    context = canvas.getContext('2d'); 
    context.clearRect(0, 0, 500, 350);

    ticTacToe = new TTTField(0, 0, canvas.width, canvas.height);
    document.addEventListener("click", ticTacToe.mouseClicked);
    
    // Background 
    splash = new Image();
    splash.src = "splash.png";
    splash.onload = function()
    {
        context.drawImage(splash, 75, 150);
    };

    update();
}

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function TTTField(x, y, width, height) 
{
    this.width = width;
    this.height = height;

    // 0 = empty, 1 = X, 2 = O
    this.Tile = function(y, x)
    {
        this.x = x;
        this.y = y;
        this.renderX = (x * 100) + 100;
        this.renderY = (y * 100) + 25;
        this.value = 0;
    }

    this.board =
    [
        [new this.Tile(0, 0), new this.Tile(1, 0), new this.Tile(2, 0)],        
        [new this.Tile(0, 1), new this.Tile(1, 1), new this.Tile(2, 1)],       
        [new this.Tile(0, 2), new this.Tile(1, 2), new this.Tile(2, 2)]
    ];

    this.mouseClicked = function(event)
    {
        if (!playing)
        {     
            context.clearRect(0, 0, 500, 350);

            bg = new Image();
            bg.src = "board.png";
            bg.onload = function()
            {
                context.drawImage(bg, 0, 0);
            };

            playing = true;            
            new Audio('alert_entry_a.ogg').play();

            if (hardDifficulty)
                document.getElementById("title-text").innerText = "Difficulty: Hard";
            else
                document.getElementById("title-text").innerText = "Difficulty: Easy";

            asyncLoop();
        }

        if (isComputersTurn == true)
            return;

        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.x;
        var y = event.clientY - rect.y;

        var tileX = Math.floor((x - 100) / 100);
        var tileY = Math.floor((y - 25) / 100);

        // Check if they even clicked on the playing board
        if (tileX < 0 || tileX > 2 || tileY < 0 || tileY > 2)
            return;

        // Clicked on an empty slot
        if (ticTacToe.board[tileX][tileY].value == 0)
        {
            ticTacToe.board[tileX][tileY].value = PLAYER;
            new Audio('pc_write.mp3').play();
            isComputersTurn = true;
        }

        update();
    }
}

function drawScore()
{
    // Scoreboard
    document.getElementById("score-text").innerText = 
        formScoreString(score_win, score_tie, score_loss);
}

TTTField.prototype.draw = function()
{ 
    if (!playing)
        return;

    // Grid board
    board = new Image();
    board.onload = function()
    {
        context.drawImage(board, 0, 0);
    };

    drawMarks = function(marker, desiredValue)
    {
        for (var x = 0; x < ticTacToe.board.length; ++x)
        {
            for (var y = 0; y < ticTacToe.board[x].length; ++y)
            {
                if (ticTacToe.board[x][y].value == desiredValue)
                    context.drawImage(marker, ticTacToe.board[x][y].renderX, ticTacToe.board[x][y].renderY);
            }
        }
    }

    markerX = new Image();
    markerX.src = "x.png";
    markerX.onload = function() { drawMarks(markerX, 1); };

    markerO = new Image();
    markerO.src = "o.png";
    markerO.onload = function() { drawMarks(markerO, 2); };

    drawScore();
}

TTTField.prototype.run = function(dt) 
{
    console.log("run");
}

function formScoreString(win, tie, loss)
{
    return "Win: " + win + " | Tie: " + tie + " | Loss: " + loss;
}

function update()
{
    pickWinningTile(PLAYER);
    pickWinningTile(COMPUTER);
    checkTie();
    ticTacToe.draw(context);
}

function setTile(tile, value)
{
    console.log("setTile", tile, value);
    
    for (var x = 0; x < ticTacToe.board.length; ++x)
    {
        for (var y = 0; y < ticTacToe.board[x].length; ++y)
        {
            if (ticTacToe.board[x][y].x == tile.x &&
                ticTacToe.board[x][y].y == tile.y)
            {
                ticTacToe.board[x][y].value = value;
                return;
            }
        }
    }
}

function resetBoard()
{
    for (var x = 0; x < ticTacToe.board.length; ++x)
    {
        for (var y = 0; y < ticTacToe.board[x].length; ++y)
            ticTacToe.board[x][y].value = EMPTY;
    }
}

function checkTie()
{
    if (winner != EMPTY)
        return;

    for (var x = 0; x < ticTacToe.board.length; ++x)
    {
        for (var y = 0; y < ticTacToe.board[x].length; ++y)
        {
            if (ticTacToe.board[x][y].value == EMPTY)
                return;
        }
    }

    winner = TIE;
}

function getTile(tile)
{
    for (var x = 0; x < ticTacToe.board.length; ++x)
    {
        for (var y = 0; y < ticTacToe.board[x].length; ++y)
        {
            if (ticTacToe.board[x][y].x == tile.x &&
                ticTacToe.board[x][y].y == tile.y)
            {
                return ticTacToe.board[x][y].value;
            }
        }
    }

    return 0;
}

function pickWinningTile(guy)
{
    TileChoice = function(x, y)
    {
        this.x = x;
        this.y = y;
    };

    this.winConditions =
    [
        // Across
        [new this.TileChoice(0, 0), new this.TileChoice(1, 0), new this.TileChoice(2, 0)],
        [new this.TileChoice(0, 1), new this.TileChoice(1, 1), new this.TileChoice(2, 1)],
        [new this.TileChoice(0, 2), new this.TileChoice(1, 2), new this.TileChoice(2, 2)],
        
        // Down
        [new this.TileChoice(0, 0), new this.TileChoice(0, 1), new this.TileChoice(0, 2)],
        [new this.TileChoice(1, 0), new this.TileChoice(1, 1), new this.TileChoice(1, 2)],
        [new this.TileChoice(2, 0), new this.TileChoice(2, 1), new this.TileChoice(2, 2)],

        // Diag
        [new this.TileChoice(0, 0), new this.TileChoice(1, 1), new this.TileChoice(2, 2)],
        [new this.TileChoice(0, 2), new this.TileChoice(1, 1), new this.TileChoice(2, 0)],
    ];

    var bestOne = undefined;
    var bestTwo = undefined;
    var bestThree = undefined;
    maxSuccess = 0;

    for (var i = 0; i < this.winConditions.length; ++i)
    {
        var one = this.winConditions[i][0];
        var two = this.winConditions[i][1];
        var three = this.winConditions[i][2];
    
        var successCount = 0;

        if (getTile(one) == guy)
            successCount = successCount + 1;

        if (getTile(two) == guy)
            successCount = successCount + 1;            

        if (getTile(three) == guy)
            successCount = successCount + 1;

        if (successCount >= 3)
        {
            console.log("winner");
            winner = guy;
            return;
        }
        
        // Is this a possible win condition
        if ((getTile(one) == EMPTY || getTile(one) == guy) &&
            (getTile(two) == EMPTY || getTile(two) == guy) &&
            (getTile(three) == EMPTY || getTile(three) == guy))
        {
            if (successCount >= maxSuccess)
            {
                if (guy == PLAYER)
                {
                    console.log("one", one);
                    console.log("two", two);
                    console.log("three", three);
                }

                maxSuccess = successCount;
                bestOne = one;
                bestTwo = two;
                bestThree = three;     
            }
        }
    }

    if (maxSuccess > 0)
    {        
        if (getTile(bestOne) == EMPTY)
            return ticTacToe.board[bestOne.x][bestOne.y];
    
        if (getTile(bestTwo) == EMPTY)
            return ticTacToe.board[bestTwo.x][bestTwo.y];
    
        if (getTile(bestThree) == EMPTY)
            return ticTacToe.board[bestThree.x][bestThree.y];
    }
}

function pickComputerTile()
{    
    if (hardDifficulty)
    {
        var playerWinningTile = pickWinningTile(PLAYER);
        var playerMaxSuccess = maxSuccess;

        var computerWinningTile = pickWinningTile(COMPUTER);
        var computerMaxSuccess = maxSuccess;

        console.log("playerWinningTile", playerWinningTile);
        console.log("playerMaxSuccess", playerMaxSuccess);

        console.log("computerMaxSuccess", computerMaxSuccess);
        console.log("computerWinningTile", computerWinningTile);

        if (playerMaxSuccess > 1 && computerMaxSuccess < 2)
            return playerWinningTile;

        if (computerMaxSuccess > 0)
            return computerWinningTile;
    }

    var tiles = [];
    
    for (var x = 0; x < ticTacToe.board.length; ++x)
    {
        for (var y = 0; y < ticTacToe.board[x].length; ++y)
        {
            if (ticTacToe.board[x][y].value == EMPTY)
                tiles.push(ticTacToe.board[x][y]);
        }
    }

    console.log("random");
    return tiles[Math.floor(Math.random()*tiles.length)];
}
  
async function asyncLoop() 
{
    while (true)
    {
        await sleep(100);

        if (isComputersTurn)
        {
            if (winner == EMPTY)
            {
                await sleep(firstSleep);

                if (firstSleep == 500)             
                    firstSleep = 1500;

                var chosenTile = pickComputerTile();

                if (chosenTile != undefined)
                {
                    new Audio('npc_write.mp3').play();
                    var done = false;
                    setTile(chosenTile, COMPUTER);
                    update();
                }
            }
    
            if (winner != EMPTY)
            {
                await sleep(1000);

                if (winner == PLAYER)        
                {
                    score_win = score_win + 1;
                    new Audio('win.ogg').play();
                    document.getElementById("title-text").innerText = "You Won!";
                }
                else if (winner == COMPUTER)        
                {
                    score_loss = score_loss + 1;
                    new Audio('lose.ogg').play();
                    document.getElementById("title-text").innerText = "You Lost!";
                }
                else
                {
                    score_tie = score_tie + 1;
                    new Audio('tie.ogg').play();
                    document.getElementById("title-text").innerText = "You Tied!";
                }

                drawScore();
                winner = EMPTY;
                resetBoard();  
                await sleep(1000);                
                context.drawImage(splash, 75, 150);
                playing = false;  
                hardDifficulty = !hardDifficulty;
                return;       
            }
            else
            {
                isComputersTurn = false;
            }
        }
    }
}