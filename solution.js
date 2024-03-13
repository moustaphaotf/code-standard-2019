fs = require('fs/promises')



class Graph {
    constructor(map) {
        const nbRows = map.length;
        const nbCols = map[0].length;

        this.nodes = []
        const total = nbCols * nbRows;
        let black = 0
        for(let i = 0; i < nbRows; i++) {
            for (let j = 0; j < nbCols; j++) {
                if(map[i][j] !== '#') {
                    this.nodes.push([j, i, this.getCost(map[i][j])])
                }
                else {
                    black++
                }
            }
        }

        console.log({total, black})
    }

    dijkstra(source) {
        const dist = Array(this.nodes.length).fill(Number.MAX_VALUE)
        // const prev = Array(this.nodes.length).fill(undefined);
        const Q = []
        for(let i = 0; i < this.nodes.length; i++) {
            Q.push(i);   
        }

        dist[source] = 0;

        while(Q.length !== 0) {
            const u = minDist(dist) // A définir
            Q = Q.filter(i => i !== u);

            const neighbors = this.neighbors(getNode(u));
            for(let v of neighbors) {
                if(Q.indexOf(n) !== -1) {
                    const dstNode = this.getNode(v);
                    const alt = dist[u] + dstNode[2];

                    if (alt < dist[v]) {
                        dist[v] = alt;
                        // prev[v] = u;
                    }
                }
            }

        }

        return { dist, prev}
    }

    getCost(chr) {
        const costs = {
            '~': 800,
            '*': 200,
            '+': 150,
            'X': 120,
            '_': 100,
            'H': 70,
            'T': 50
        }

        return costs[chr];
    }

    neighbors(node) {
        if (node) {
            const dirs = [ [1, 0], [0, 1], [-1, 0],[0,-1]];
            const result = []
            for(let dir of dirs) {
                const tmp = [node[0] + dir[0], node[1] + dir[1]];
                const idx = this.nodes.findIndex(n => n[0] == tmp[0] && n[1] == tmp[1]);
                if(idx !== -1) {
                    result.push(idx)
                }
            }
            return result;
        } else {
            throw new Error('Node not found !')
        }
    }

    getNode(idx) {
        return this.nodes[idx]
    }
}

async function getFile (filename) {
    try {
        const data = await fs.readFile(filename, { encoding: 'utf-8'});
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function main () {
    const response = getFile('./1_victoria_lake.txt');
    response.then(data => {
        // Définir la largeur et la hauteur de la carte
        const rows = data.split('\r\n');
        const nbClients = parseInt(rows[0]);
        const clients = rows.slice(1, nbClients + 1);
        const boxClients = []
        
        for(let i = 0; i < clients.length; i++) {
            clients[i] = clients[i].split(' ');
            boxClients.push(clients[i][0] + clients[i][1]);
        }

        let map = rows.slice(nbClients + 1);


        const graph = new Graph(map);
        console.log(graph)

        const node = graph.getNode(144);
        console.log(node)
        console.log("Neighbors:")
        for(let n of graph.neighbors(node)) {
            console.log(graph.nodes[n])
        }

        console.log({map})
    })

}

main();