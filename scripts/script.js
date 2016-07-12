//Shape prototype
var Shape = function(){
  //defaut array of possible shapes and matching colours
  this.shapeColArr = [
    {
      shape: "dot",
      color: "#ED6A5A",
      coord: [[0,0]],
      startPoint: {x:2, y:2}
    },{
      shape: "vertLine1",
      color: "#81A4CD",
      coord: [[0,0],[1,0]],
      startPoint: {x:1, y:2}
    },{
      shape: "horzLine1",
      color: "#99C24D",
      coord: [[0,0],[0,1]],
      startPoint: {x:2, y:2}
    },{
      shape: "square",
      color: "#9B59B6",
      coord: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],
      startPoint: {x:1, y:1}
    },{
      shape: "vertLine4",
      color: "#E67E22",
      coord: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]],
      startPoint: {x:2, y:0}
    }
  ];
  this.randShapeIndex = Math.floor(Math.random()*this.shapeColArr.length);
  this.genShape();
};
Shape.prototype.genShape = function(){
  this.shapeAttr = this.shapeColArr[this.randShapeIndex];
};
$(document).ready(function(){
  var pieceContainer = $('.pieceContainer');
  var mainBoard = $('.board');
  var startingCoord = [];
  var endingCoord = [];
  var diffCoords = [];

  function prepareBoard(){
    //create random shape container
    for(var row = 0; row < 5; row++){
      for(var col = 0; col < 5; col++){
        var piece = $('<div>').attr({class:'pcSquare empty', "data-xCoord":col, "data-yCoord":row});
        pieceContainer.append(piece);
      }
    }
    //create board
    for(var boardRow = 0; boardRow < 10; boardRow++){
      for(var boardCol = 0; boardCol < 10; boardCol++){
        var boardSq = $('<div>').attr({class:'boardSquare droppable',"data-xCoord":boardCol, "data-yCoord":boardRow});
        mainBoard.append(boardSq);
      }
    }
  }
  //function for piece generation
  function generateNewPiece(){
    var gamePiece = new Shape();
    var pieceAttr = gamePiece.shapeAttr;
    var color = pieceAttr.color;

    for(var i = 0; i < pieceAttr.coord.length; i++){
        var xCoordinate = pieceAttr.coord[i][0];
        var yCoordinate = pieceAttr.coord[i][1];
        var square = pieceContainer.find('[data-xCoord=' + xCoordinate + '][data-yCoord=' + yCoordinate + ']');
        square.css('background',color).attr('class','pcSquare filled');
    }
    //add draggable functionality on pieces
    $('.draggable').draggable({
      cursor: 'move',
      // helper:'clone',
      revert: false
    });
  }
  //the coordinates of the piece where the player clicked
  function getStartingCoord(){
    $('.pcSquare').mousedown(function(){
      var x = $(this).data("xcoord");
      var y = $(this).data("ycoord");
      startingCoord = [x,y];
    });
  }
  //the coordinates of the clicked position on the board
  function getEndingCoord(obj){
    var x = obj.data("xcoord");
    var y = obj.data("ycoord");
    // console.log("endingCoord-x: " + x + ", endingcoord-y: " + y);
    endingCoord = [x,y];
  }
  //prepare the board
  prepareBoard();
  generateNewPiece();
  getStartingCoord();

  //add droppable listener
  $('.droppable').droppable({
    //when mouse pointer overlaps droppable element
    tolerance: "pointer",
    revert: false,
    drop: function(event, ui){
      //retrieve filled squares of piece
      var piece = $('.pcSquare.filled');
      var pcColor = piece.first().css('background-color');

      getEndingCoord($(this));
      getStartingCoord();
      piece.each(function(){
        // console.log($(this).data('xcoord') + ", " + $(this).data('ycoord'));
        getDifference();
        var corrX = $(this).data('xcoord') + diffCoords[0];
        var corrY = $(this).data('ycoord') + diffCoords[1];
        $('.boardSquare[data-xcoord=' + corrX + '][data-ycoord='+corrY+']').css("background-color",pcColor);
      });
      ui.helper.remove();
    }
  });
  function getDifference(){
    var diffX = endingCoord[0] - startingCoord[0];
    var diffY = endingCoord[1] - startingCoord[1];
    diffCoords = [diffX, diffY];
  }


});
