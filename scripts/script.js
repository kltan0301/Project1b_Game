//Shape prototype
var Shape = function() {
  //defaut array of possible shapes and matching colours
  this.shapeColArr = [{
    shape: "dot",
    //turquoise
    color: "#1ABC9C",
    coord: [
      [0, 0]
    ],
    startPoint: {
      x: 2,
      y: 2
    }
  }, {
    shape: "vertLine2",
    //indigo
    color: "#496AC5",
    coord: [
      [0, 0],
      [0, 1]
    ],
    startPoint: {
      x: 2,
      y: 1
    }
  }, {
    shape: "vertLine3",
    //blue
    color: "#3498DB",
    coord: [
      [0, 0],
      [0, 1],
      [0, 2]
    ],
    startPoint: {
      x: 2,
      y: 1
    }
  }, {
    shape: "square4",
    //amethyst
    color: "#9B59B6",
    coord: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1]
    ],
    startPoint: {
      x: 2,
      y: 2
    }
  }, {
    shape: "horzLine3",
    //orange
    color: "#E67E22",
    coord: [
      [0, 0],
      [1, 0],
      [2, 0]
    ],
    startPoint: {
      x: 1,
      y: 2
    }
  }, {
    shape: "square9",
    //green
    color: "#92F22A",
    coord: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2]
    ],
    startPoint: {
      x: 1,
      y: 1
    }
  }, {
    shape: "vertLine5",
    //yellow
    color: "#F1C40F",
    coord: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5]
    ],
    startPoint: {
      x: 2,
      y: 0
    }
  }, {
    shape: "lShape",
    //red
    color: "#E74C3C",
    coord: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 2]
    ],
    startPoint: {
      x: 1,
      y: 1
    }
  }];
  this.randShapeIndex = Math.floor(Math.random() * this.shapeColArr.length);
  this.genShape();
};
//function to generate a random shape
Shape.prototype.genShape = function() {
  this.shapeAttr = this.shapeColArr[this.randShapeIndex];
};
$(document).ready(function() {
  // var pieceContainer = $('.pieceContainer');
  var mainBoard = $('.board');
  var startingCoord = [0, 0];
  var endingCoord = [0, 0];
  var diffCoords = [0, 0];
  // var staticContainer = $('.staticContainer');
  var defaultCol = 'rgb(236, 240, 241)';
  var ttlRows = 10;
  var ttlCols = 10;
  var p1Score = 0,
    p2Score = 0;
  var shape;
  var startMin = 5,
    startSec = 60;
  var currPlayer = "p1";
  //prepares board based on number of rows, cols and adds listeners
  function prepareBoard() {
    //create board
    for (var boardRow = 0; boardRow < ttlRows; boardRow++) {
      for (var boardCol = 0; boardCol < ttlCols; boardCol++) {
        var boardSq = $('<div>').attr({
          class: 'boardSquare droppable',
          'data-xCoord': boardCol,
          "data-yCoord": boardRow
        });
        mainBoard.append(boardSq);
      }
    }
    //add droppable listener for the board squares
    $('.droppable').droppable({
      //when mouse pointer overlaps droppable element
      tolerance: "pointer",
      // revert: false,
      drop: function(event, ui) {
        //retrieve filled squares of piece
        var piece = $('.pcSquare.filled.' + currPlayer);
        var pcColor = piece.first().css('background-color');
        //get ending coordinates
        getEndingCoord($(this));

        var clickedXCoord = endingCoord[0];
        var clickedYCoord = endingCoord[1];
        //check validity of move
        getDifference();
        var isValid = isValidMove(piece);

        if (isValid) {
          piece.each(function() {
            // color board squares based on piece squares
            var corrX = $(this).data('xcoord') + diffCoords[0];
            var corrY = $(this).data('ycoord') + diffCoords[1];

            $('.boardSquare[data-xcoord=' + corrX + '][data-ycoord=' + corrY + ']').addClass('filled').css("background-color", pcColor);
          });
          ui.helper.remove();
          generateNewPiece(currPlayer);

          //updates score if player completes row/col
          var turnScore = horzFillCheck() + vertFillCheck();
          if (turnScore > 0) {
            if (currPlayer === "p1") {
              p1Score += turnScore;
              $('.player1').text("Score: " + p1Score);
            } else {
              p2Score += turnScore;
              $('.player2').text("Score: " + p2Score);
            }
          }
          switchTurn();
        } else {
          $('.pieceContainer').css({
            left: 20,
            top: 30
          });
        }

        console.log("curr turn: " + currPlayer);
      }
    });
    //add clickable listener for cover on
    $('.coverOn').on('click', function() {
      // alert("Sorry, it isin't your turn yet!");
      swal({
        title: 'Not your turn yet!',
        confirmButtonText: 'Darn, alright',
        width: 300,
        timer: 2000
      });
    });
  }
  //the coordinates of the piece where the player clicked
  function getStartingCoord() {
    $('.pcSquare').mousedown(function() {
      var x = $(this).data("xcoord");
      var y = $(this).data("ycoord");
      startingCoord = [x, y];
      console.log("GetstartingCoord:" + startingCoord[0] + "," + startingCoord[1]);
    });
  }
  //function to create new draggable piece
  function generateNewPiece(player) {
    var staticContainer = "";
    //checks which player before appending to container
    if (player == "p1") {
      staticContainer = $('.staticContainer');
    } else {
      staticContainer = $('.staticContainer2');
    }
    //generate new shape object
    shape = new Shape();
    var pieceAttr = shape.shapeAttr;
    var color = pieceAttr.color;
    //create a new draggable object
    var pieceContainer = $('<div>').attr('class', 'pieceContainer draggable');
    //add empty squares in the container
    for (var row = 0; row < 5; row++) {
      for (var col = 0; col < 5; col++) {
        var piece = $('<div>').attr({
          class: 'pcSquare empty ' + player,
          'data-xCoord': col,
          "data-yCoord": row
        });
        pieceContainer.append(piece);
      }
    }
    //color the squares based on the shape
    for (var i = 0; i < pieceAttr.coord.length; i++) {
      var xCoordinate = pieceAttr.coord[i][0] + pieceAttr.startPoint.x;
      var yCoordinate = pieceAttr.coord[i][1] + pieceAttr.startPoint.y;
      var square = pieceContainer.find('[data-xCoord=' + xCoordinate + '][data-yCoord=' + yCoordinate + ']');
      square.css('background', color).attr('class', 'pcSquare filled ' + player);
    }
    staticContainer.append(pieceContainer);
    //add draggable functionality on pieces
    $('.draggable').draggable({
      cursor: 'move',
      revert: "invalid"
    });
    //add mouse down listener to find out where coordinates player is clicking on the piece
    getStartingCoord();
  }
  //the coordinates of the clicked position on the board
  function getEndingCoord(obj) {
    var x = obj.data("xcoord");
    var y = obj.data("ycoord");
    endingCoord = [x, y];
    console.log("Inside get ending coord: " + endingCoord[0] + "," + endingCoord[1]);
  }
  //difference between the points
  function getDifference() {
    var diffX = endingCoord[0] - startingCoord[0];
    var diffY = endingCoord[1] - startingCoord[1];
    diffCoords = [diffX, diffY];
    console.log(diffCoords);
  }
  //function to clear off all pieces in row/col
  function clearCells(type, index) {
    if (type === "row") {
      $('.boardSquare[data-ycoord=' + index + ']').animate({
        backgroundColor: defaultCol
      });
    } else {
      $('.boardSquare[data-xcoord=' + index + ']').animate({
        backgroundColor: defaultCol
      });
    }
  }
  //checks for completed horizontal rows and returns completed row count
  function horzFillCheck() {
    var horzFillCount = 0;
    for (var i = 0; i < ttlCols; i++) {
      var rowList = $('.boardSquare.filled[data-ycoord=' + i + ']');
      var filledInRow = rowList.length;
      if (filledInRow === 10) {
        rowList.removeClass('filled');
        clearCells("row", i);
        horzFillCount++;
      }
    }
    return horzFillCount;
  }
  //checks for completed row count
  function vertFillCheck() {
    var vertFillCount = 0;
    for (var i = 0; i < ttlRows; i++) {
      var colList = $('.boardSquare.filled[data-xcoord=' + i + ']');
      var filledInCol = colList.length;
      if (filledInCol === 10) {
        colList.removeClass('filled');
        clearCells("col", i);
        vertFillCount++;
      }
    }
    return vertFillCount;
  }
  //check valid move
  function isValidMove(pieceCoords) {
    var invalidCount = 0;

    pieceCoords.each(function() {

      var corrX = $(this).data('xcoord') + diffCoords[0];
      var corrY = $(this).data('ycoord') + diffCoords[1];

      var boardSq = $('.boardSquare[data-xcoord=' + corrX + '][data-ycoord=' + corrY + ']');

      if (boardSq.css('background-color') !== defaultCol) {
        invalidCount++;
      }
    });
    if (invalidCount > 0) {
      return false;
    } else {
      return true;
    }
  }

  //function for decreasing the timer
  function startTimer(min, sec) {
    $('#min').text("0" + min);
    //decrease the minutes the first time
    setTimeout(function() {
      min--;
      $('#min').text("0" + min);
    }, 1000);

    //update the time every second
    var secInterval = setInterval(function() {
      sec--;

      if (sec === 0 && min === 0) {
        $('#sec').text("0" + sec);
        clearInterval(secInterval);
      } else if (sec === 0) {
        $('#sec').text("0" + sec);
        sec = 60;
        min--;
      } else if (sec === 59) {
        $('#sec').text(sec);
        $('#min').text("0" + min);
      } else if (sec < 10) {
        $('#sec').text("0" + sec);
      } else {
        $('#sec').text(sec);
      }
    }, 1000);
  }
  //switch cover for player section
  function switchTurn() {
    if (currPlayer === "p1") {
      currPlayer = "p2";
      $('.player2Section .coverOn').attr('class', 'coverOff');
      $('.player1Section .coverOff').attr('class', 'coverOn');
    } else {
      currPlayer = "p1";
      $('.player1Section .coverOn').attr('class', 'coverOff');
      $('.player2Section .coverOff').attr('class', 'coverOn');
    }
    if ($('.coverOn').onclick === undefined) {
      $('.coverOn').on('click', function() {
        swal({
          title: 'Not your turn yet!',
          confirmButtonText: 'Darn, alright',
          width: 300,
          timer: 2000
        });
      });
    }
  }
  //check if it's the first round
  var firstTurn = true;
  //create new startscreen
  function startGame() {
    $(document).keydown(function(e) {
      if (e.which === 32 && firstTurn) {
        $('.startMenu').addClass('visibleOff');
        //prepare the board
        prepareBoard();
        // generateNewPiece() for first play;
        generateNewPiece("p1");
        generateNewPiece("p2");

        startTimer(startMin, 60);

        //Returns winner when time runs out
        setTimeout(function() {
          $('#sec').text("00");
          var winner;
          if (p1Score > p2Score) {
            winner = "Player 1 has won!";
          } else if (p1Score < p2Score) {
            winner = "Player 2 has won!";
          } else {
            winner = "It's a draw!";
          }

          swal({
            title: winner,
            background: '#FFDE29',
            width: 300,
            confirmButtonText: 'Restart Game',
            allowOutsideClick: false
          }).then(function() {
            location.reload();
          });
        }, startMin * 60 * 1000);

        firstTurn = false;
      }
    });

    $(document).keydown(function(e) {
      if (e.which === 27) {
        location.reload();
      }
    });
  }
  startGame();
  $('#bgMusic').trigger('play');
  //allows player to skip turn
  $('.skip').click(function() {
    if (currPlayer === "p1") {
      $('.player1Section .staticContainer .pieceContainer').remove();
    } else {
      $('.player2Section .staticContainer2 .pieceContainer').remove();
    }
    generateNewPiece(currPlayer);
    switchTurn();
  });
});
