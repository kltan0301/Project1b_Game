//Shape prototype
var Shape = function(){
  //defaut array of possible shapes and matching colours
  this.shapeColArr = [
    {
      shape: "dot",
      //turquoise
      color: "#1ABC9C",
      coord: [[0,0]],
      startPoint: {x:2, y:2}
    },{
      shape: "vertLine2",
      //emerald
      color: "#2ECC71",
      coord: [[0,0],[0,1]],
      startPoint: {x:2, y:1}
    },{
      shape: "vertLine3",
      //blue
      color: "#3498DB",
      coord: [[0,0],[0,1],[0,2]],
      startPoint: {x:2, y:1}
    },{
      shape: "square4",
      //amethyst
      color: "#9B59B6",
      coord: [[0,0],[0,1],[1,0],[1,1]],
      startPoint: {x:2, y:2}
    },{
      shape: "horzLine3",
      //orange
      color: "#E67E22",
      coord: [[0,0],[1,0],[2,0]],
      startPoint: {x:2, y:0}
    },{
      shape: "square9",
      //asphalt
      color: "#34495E",
      coord: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],
      startPoint: {x:1, y:1}
    },{
      shape: "vertLine5",
      //yellow
      color: "#F1C40F",
      coord: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]],
      startPoint: {x:2, y:0}
    },{
      shape: "lShape",
      //red
      color: "#E74C3C",
      coord: [[0,0],[0,1],[0,2],[1,2],[2,2]],
      startPoint: {x:1, y:1}
    }
  ];
  this.randShapeIndex = Math.floor(Math.random()*this.shapeColArr.length);
  this.genShape();
};
Shape.prototype.genShape = function(){
  this.shapeAttr = this.shapeColArr[this.randShapeIndex];
};
$(document).ready(function(){
  // var pieceContainer = $('.pieceContainer');
  var mainBoard = $('.board');
  var startingCoord = [];
  var endingCoord = [];
  var diffCoords = [];
  var staticContainer = $('.staticContainer');

  function prepareBoard(){
    //create board
    for(var boardRow = 0; boardRow < 10; boardRow++){
      for(var boardCol = 0; boardCol < 10; boardCol++){
        var boardSq = $('<div>').attr({class:'boardSquare droppable','data-xCoord':boardCol, "data-yCoord":boardRow});
        mainBoard.append(boardSq);
      }
    }
  }
  //the coordinates of the piece where the player clicked
  function getStartingCoord(){
    $('.pcSquare').mousedown(function(){
      var x = $(this).data("xcoord");
      var y = $(this).data("ycoord");
      startingCoord = [x,y];
    });
  }
  //function to create new draggable piece
  function generateNewPiece(){
    //generate new shape object
    var shape = new Shape();
    var pieceAttr = shape.shapeAttr;
    var color = pieceAttr.color;
    //create a new draggable object
    var pieceContainer = $('<div>').attr('class','pieceContainer draggable');
    //add empty squares in the container
    for(var row = 0; row < 5; row++){
      for(var col = 0; col < 5; col++){
        var piece = $('<div>').attr({class:'pcSquare empty', 'data-xCoord':col, "data-yCoord":row});
        pieceContainer.append(piece);
      }
    }
    //color the squares based on the shape
    for(var i = 0; i < pieceAttr.coord.length; i++){
        var xCoordinate = pieceAttr.coord[i][0] + pieceAttr.startPoint.x;
        var yCoordinate = pieceAttr.coord[i][1] + pieceAttr.startPoint.y;
        var square = pieceContainer.find('[data-xCoord=' + xCoordinate + '][data-yCoord=' + yCoordinate + ']');
        square.css('background',color).attr('class','pcSquare filled');
    }
    staticContainer.append(pieceContainer);
    //add draggable functionality on pieces
    $('.draggable').draggable({
      cursor: 'move',
      // helper:'clone',
      revert: false
    });
    getStartingCoord();
  }

  //the coordinates of the clicked position on the board
  function getEndingCoord(obj){
    var x = obj.data("xcoord");
    var y = obj.data("ycoord");
    endingCoord = [x,y];
  }
  //prepare the board
  prepareBoard();
  // generateNewPiece();
  generateNewPiece();
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

      piece.each(function(){
        // console.log($(this).data('xcoord') + ", " + $(this).data('ycoord'));
        getDifference();
        var corrX = $(this).data('xcoord') + diffCoords[0];
        var corrY = $(this).data('ycoord') + diffCoords[1];
        $('.boardSquare[data-xcoord=' + corrX + '][data-ycoord='+corrY+']').css("background-color",pcColor);
      });
      ui.helper.remove();
      generateNewPiece();
    }
  });
  function getDifference(){
    var diffX = endingCoord[0] - startingCoord[0];
    var diffY = endingCoord[1] - startingCoord[1];
    diffCoords = [diffX, diffY];
  }
});
