class astar {

    constructor() {}
    init(nodes,edges,startNode,goalNode) {
        this.nodes = nodes;
        this.edges = edges;
        this.starterNode = startNode;
        this.GoalNode = goalNode;
        this.queue = [ {nodes :  [ startNode ] , g : 0 , f : parseInt(startNode.heuristic) , extendAble : true }] ;
    }

    getResult(){
        var extendAble = false ;
        do {
            extendAble = false;
            var minFId = 0;
            var minFValue = Number.MAX_SAFE_INTEGER;
            for (var i = 0; i < this.queue.length; i++) {
                if (this.queue[i].f < minFValue) {
                    minFValue = this.queue[i].f;
                    minFId = i;
                }
                if (this.queue[i].extendAble) {
                    extendAble = true;
                }
            }

            if (this.queue[minFId].nodes[this.queue[minFId].nodes.length - 1] === this.GoalNode)
                return this.queue[minFId].nodes;

            var newQueue = this.extractLeaf(this.queue[minFId]);
            this.queue.splice(minFId, 1);
            for (i = 0; i < newQueue.length; i++)
                this.queue.splice(minFId, 0, newQueue[i]);

        } while ( extendAble );
        return 'no way !!';
    }

    extractLeaf(queueLeaf){
        var shouldReplace = [];
        var shouldReplaceIndex = 0;
        var lastNodeInQueueLeaf = queueLeaf.nodes[queueLeaf.nodes.length-1];
        var nodes = this.nodes;
        var newNodeRun = [];
        if ( typeof this.edges[lastNodeInQueueLeaf.name] === "undefined" ){
            queueLeaf.extendAble = false ;
            shouldReplace[shouldReplaceIndex] = queueLeaf;
            return shouldReplace ;
        }
        $.each(this.edges[lastNodeInQueueLeaf.name], function (nameOfEdgeTo, EdgeInformation) {
            var g = parseInt( parseInt(queueLeaf.g) + parseInt(EdgeInformation.cost) ) ;
            var f  = parseInt(g) ;
            newNodeRun = Array.from(queueLeaf.nodes) ;
            for ( var i = 0 ; i < nodes.length ; i++  ){
                if ( nodes[i].name === nameOfEdgeTo ) {
                    f = parseInt(g) + parseInt(nodes[i].heuristic);
                    newNodeRun.push(nodes[i]);
                }
            }
            shouldReplace[shouldReplaceIndex] = { nodes : newNodeRun , g : g ,  f : f  , extendAble : true };
            shouldReplaceIndex++;
        });
        if ( shouldReplaceIndex === 0 ) {
            queueLeaf.extendAble = false ;
            shouldReplace[shouldReplaceIndex] = queueLeaf;
        }

        return shouldReplace ;
    }

}