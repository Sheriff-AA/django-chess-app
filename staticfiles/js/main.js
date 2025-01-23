var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn');
  firstMove = true;


// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};

var onDrop = function(source, target) {
  var promotion = $('#promotion').val();
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: promotion // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

   if (firstMove) {
      $('#sideSelector').hide();
      firstMove = false;
    }

  updateStatus();
  getResponseMove();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
    board.position(game.fen());
};

var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  setStatus(status);
  getLastCapture();
  createTable();
  updateScroll();
  getCapturedPieces();
  evaluateCurrentPosition();

  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

var randomResponse = function() {
    fen = game.fen()
    $.get("/move/" + fen, function(data) {
        game.move(data, {sloppy: true});
        // board.position(game.fen());
        updateStatus();
    })
}

var getResponseMove = function() {
    var e = document.getElementById("sel1");
    var depth = e.options[e.selectedIndex].value;
    fen = game.fen()
    $.get("/move/" + depth + "/" + fen, function(data) {
        game.move(data, {sloppy: true});
        updateStatus();
        // This is terrible and I should feel bad. Find some way to fix this properly.
        // The animations would stutter when moves were returned too quick, so I added a 100ms delay before the animation
        setTimeout(function(){ board.position(game.fen()); }, 100);
    })
}


// did this based on a stackoverflow answer
// http://stackoverflow.com/questions/29493624/cant-display-board-whereas-the-id-is-same-when-i-use-chessboard-js
$(document).ready(function() {
    setTimeout(function() {
        board = ChessBoard('board', cfg);
        // updateStatus();
    }, 0);
});

var setPGN = function() {
  var table = document.getElementById("pgn");
  var pgn = game.pgn().split(" ");
  var move = pgn[pgn.length - 1];
}

var createTable = function() {

    var pgn = game.pgn().split(" ");
    var data = [];

    for (i = 0; i < pgn.length; i += 3) {
        var index = i / 3;
        data[index] = {};
        for (j = 0; j < 3; j++) {
            var label = "";
            if (j === 0) {
                label = "moveNumber";
            } else if (j === 1) {
                label = "whiteMove";
            } else if (j === 2) {
                label = "blackMove";
            }
            if (pgn.length > i + j) {
                data[index][label] = pgn[i + j];
            } else {
                data[index][label] = "";
            }
        }
    }

    $('#pgn tr').not(':first').remove();
    var html = '';
    for (var i = 0; i < data.length; i++) {
        html += '<tr><td>' + data[i].moveNumber + '</td><td>'
        + data[i].whiteMove + '</td><td>'
        + data[i].blackMove + '</td></tr>';
    }

    $('#pgn tr').first().after(html);
}

var updateScroll = function() {
    $('#moveTable').scrollTop($('#moveTable')[0].scrollHeight);
}

var setStatus = function(status) {
  document.getElementById("status").innerHTML = status;
}

var takeBack = function() {
   var playerColor = board.orientation();
    game.undo();
   if ((playerColor === 'white' && game.turn() === 'b') || 
      (playerColor === 'black' && game.turn() === 'w')) {
      game.undo();
    }
    board.position(game.fen());
    updateStatus();
}

var newGame = function() {
    game.reset();
    board.start();
    updateStatus();

    $('#sideSelector').show();
    firstMove = true;
}

var getCapturedPieces = function() {
    var history = game.history({ verbose: true });
    for (var i = 0; i < history.length; i++) {
        if ("captured" in history[i]) {
            console.log(history[i]["captured"]);
        }
    }
}

var getLastCapture = function() {
    var history = game.history({ verbose: true });
    var index = history.length - 1;

    if (history[index] != undefined && "captured" in history[index]) {
        console.log(history[index]["captured"]);
    }
}


var getCapturedPieces = function() {
    var history = game.history({ verbose: true });
    var capturedWhite = [];
    var capturedBlack = [];

    for (var i = 0; i < history.length; i++) {
        if ("captured" in history[i]) {
            if (history[i].color === 'w') {
                capturedBlack.push(history[i].captured);
            } else {
                capturedWhite.push(history[i].captured);
            }
        }
    }

    // Render captured pieces
    renderCapturedPieces('#piecesW', capturedWhite, 'w');
    renderCapturedPieces('#piecesB', capturedBlack, 'b');
};

var renderCapturedPieces = function(selector, pieces, color) {
    var html = '';
    for (var i = 0; i < pieces.length; i++) {
        html += `<img src="/static/img/chesspieces/wikipedia/${color}${pieces[i].toUpperCase()}.png" alt="${pieces[i]}">`;
    }
    $(selector).html(html);
};

var chooseSide = function(side) {
    if (side === 'black') {
        board.orientation('black');
        game.reset();
        getResponseMove(); // Make the AI move first
    } else {
        board.orientation('white');
        game.reset();
    }
    updateStatus();
    $('#sideSelector').hide();
    firstMove = false;
};

var changeTheme = function(theme) {
    $('#board').removeClass().addClass(`board-${theme}`);
};

$(document).ready(function() {
    $('#sideSelector').show();
});

var evaluatePosition = function(depth, fen, callback) {
    // Make an AJAX GET request to the backend endpoint
    var encodedFen = encodeURIComponent(fen);
    $.get(`/eval/${depth}/${encodedFen}`, function(data) {
        if (data.best_move) {
            // If there's a valid response, execute the callback with the best move and evaluation
            callback(data.best_move, data.evaluation);
        } else {
            console.error("Error in evaluation response:", data.error);
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Request failed:", textStatus, errorThrown);
    });
};

var evaluateCurrentPosition = function() {
    var e = document.getElementById("sel1"); // Get depth from dropdown
    var depth = e.options[e.selectedIndex].value;
    var fen = game.fen(); // Get current board position in FEN notation

    // Make the backend request for evaluation
    evaluatePosition(depth, fen, function(bestMove, evaluation) {
        // Display the evaluation in the #evaluation tag
        var evaluationText = evaluation > 0 
            ? `White is better by ${evaluation / 100}` 
            : evaluation < 0 
                ? `Black is better by ${-evaluation / 100}` 
                : `Position is equal`;

        if (Math.abs(evaluation) >= 10000) {
            evaluationText = evaluation > 0 
                ? "White is winning (mate in sight)" 
                : "Black is winning (mate in sight)";
        }

        $('#evaluation').html(`Eval: ${evaluationText}`);
    });
};



