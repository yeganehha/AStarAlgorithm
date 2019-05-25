var sizeCircle = 5 ;
var sizeCircleName = 10 ;
var nodes = [];
var nodeStartId = null ;
var nodeGoalId = null ;
var edge = {};
var indexOfNodes = 0 ;



function canvasClick (e) {
    var addNodeTag = true ;
    var hp = getMousePos(canvas, e);
    for ( index = 0 ; index < indexOfNodes ; index++ ){
        if (  Math.abs( nodes[index].x - hp.x ) <= sizeCircle  && Math.abs( nodes[index].y - hp.y ) <= sizeCircle ) {
            addNodeTag = false ;
            if($('#addEdge').is(':checked')) {
                startAddEdge(nodes[index]);
            }
            if($('#selectStart').is(':checked')) {
                selectStart(index);
            }
            if($('#selectGoal').is(':checked')) {
                selectGoal(index);
            }
        }
    }
    if ( addNodeTag ) {
        if($('#addNode').is(':checked')) {
            addNode(hp);
        }
    }
}
function addNode ( hp ){
    do {
        var heuristic = prompt("Please enter the Heuristic");
    } while ( ! parseInt(heuristic) > 0 ) ;
    var name = String.fromCharCode(65 + indexOfNodes) ;
    drawNode(hp.x ,  hp.y , name , "#fff5f5");
    nodes[indexOfNodes] = {x: hp.x, y: hp.y, name: name, heuristic: heuristic , color: "#fff5f5"};
    $('#listNodes').append('<tr id="nodeName_'+name+'"><td>'+name+'</td><td>'+heuristic+'</td></tr>');
    indexOfNodes++;
}
var tempStartEdge = false ;
var tempNode = null;
function startAddEdge(node) {
    if ( ! tempStartEdge  ) {
        tempStartEdge = true;
        tempNode = node ;
        $('#canvas').mousemove(function (e) {
            if ( tempStartEdge  ) {
                emptyCanvas();
                $.each(edge, function (edgeStartName, oneEdgeOfStarterNode) {
                    $.each(oneEdgeOfStarterNode, function (edgeEndName, oneEdge) {
                        drawEdge(oneEdge.startNode.x, oneEdge.startNode.y, oneEdge.endNode.x, oneEdge.endNode.y , oneEdge.startNode.name ,oneEdge.endNode.name , oneEdge.cost , oneEdge.color );
                    });
                });
                for (index = 0; index < indexOfNodes; index++) {
                    drawNode(nodes[index].x, nodes[index].y, nodes[index].name, nodes[index].color);
                }
                var hp = getMousePos(canvas, e);
                drawEdge(node.x, node.y, hp.x, hp.y, node.name ,"" , "" , "#fff5f5" );
            }
        });
    } else if ( node.name !== tempNode.name ) {
        tempStartEdge = false;
        if (typeof edge[tempNode.name] == "undefined") {
            edge[tempNode.name] = {};
        }
        if ( typeof edge[tempNode.name][node.name] == "undefined" ) {
            do {
                var cost = prompt("Please enter the Cost");
            } while ( ! parseInt(cost) > 0 ) ;
            edge[tempNode.name][node.name] = {startNode: tempNode, endNode: node, cost: cost , color : "#fff5f5" };
        }
        emptyCanvas();
        $.each(edge, function( edgeStartName, oneEdgeOfStarterNode ) {
            $.each(oneEdgeOfStarterNode, function( edgeEndName, oneEdge ) {
                drawEdge(oneEdge.startNode.x, oneEdge.startNode.y, oneEdge.endNode.x ,  oneEdge.endNode.y  , oneEdge.startNode.name ,oneEdge.endNode.name , oneEdge.cost, oneEdge.color );
            });
        });
        for (index = 0; index < indexOfNodes; index++) {
            drawNode(nodes[index].x, nodes[index].y, nodes[index].name, nodes[index].color);
        }
        tempNode = null;
    }
}
function resetCanvas(){
    location.reload();
}
function selectStart(nodeSelectedId){
    nodes[nodeSelectedId].color = "#0fbeff";
    nodeStartId = nodeSelectedId ;
    $("#selectGoal").prop("checked", true);
    emptyCanvas();
    $.each(edge, function( edgeStartName, oneEdgeOfStarterNode ) {
        $.each(oneEdgeOfStarterNode, function( edgeEndName, oneEdge ) {
            drawEdge(oneEdge.startNode.x, oneEdge.startNode.y, oneEdge.endNode.x ,  oneEdge.endNode.y  , oneEdge.startNode.name ,oneEdge.endNode.name , oneEdge.cost, oneEdge.color );
        });
    });
    for (index = 0; index < indexOfNodes; index++) {
        drawNode(nodes[index].x, nodes[index].y, nodes[index].name, nodes[index].color);
    }
    $("#selectStartDiv").html("<div style='margin:5px;'>Start Node : "+nodes[nodeSelectedId].name+"</div>");
}
function selectGoal(nodeSelectedId){
    nodes[nodeSelectedId].color = "#00ff74";
    nodeGoalId = nodeSelectedId ;
    emptyCanvas();
    $.each(edge, function( edgeStartName, oneEdgeOfStarterNode ) {
        $.each(oneEdgeOfStarterNode, function( edgeEndName, oneEdge ) {
            drawEdge(oneEdge.startNode.x, oneEdge.startNode.y, oneEdge.endNode.x ,  oneEdge.endNode.y  , oneEdge.startNode.name ,oneEdge.endNode.name , oneEdge.cost, oneEdge.color );
        });
    });
    for (index = 0; index < indexOfNodes; index++) {
        drawNode(nodes[index].x, nodes[index].y, nodes[index].name, nodes[index].color);
    }
    $("#selectGoalDiv").html("<div style='margin:5px;'>Goal Node : "+nodes[nodeSelectedId].name+"</div>");
}
$('document').ready(function(){
    var canvasDiv = document.getElementById('canvasDiv');
    canvas = document.createElement('canvas');
    canvas.setAttribute('class', 'canvas');
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);
    if(typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");

    $('#canvas').click(function(e){
        canvasClick(e);
    });

});

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}
function drawEdge(startX , startY , EndX , EndY , StartName , EndName , Cost) {
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(EndX, EndY);
    context.stroke();
    // var m =  ( EndY - startY ) / ( EndX - startX );
    var text = StartName + " -> " + EndName + " ( " + Cost + " ) ";
    // var Radian = Math.atan(m) * Math.PI / 180;
    context.fillStyle = "#000000";
    context.font = "8px Arial";
    // if ( EndY > startY ) {
    //     EndY = EndY + 20 ;
    //     EndX = EndX + 20 ;
    // } else {
    //     EndY = EndY - 20 ;
    //     EndX = EndX - 20 ;
    // }
    context.fillText(text,  ( EndX + startX )  / 2   ,  ( EndY  + startY ) / 2);

}
function drawNode(X,Y , name, color) {
    context.beginPath();
    context.arc(X, Y, sizeCircle, 0, 2 * Math.PI, false);
    context.fillStyle = color ;
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.fill();
    context.stroke();
    context.fillStyle = "#000000";
    context.font = sizeCircleName+"px Arial";
    context.fillText(name, X - ( sizeCircle / 2 ) , Y + ( sizeCircle / 2 ));
}
function emptyCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
