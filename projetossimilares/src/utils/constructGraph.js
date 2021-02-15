// const repos = ['Repo1', 'Repo2', 'Repo3']

// const routes = [
//     ['Repo1', 'Repo2'],
//     ['Repo3', 'Repo2'],
// ]

const adjacencyList = new Map();

function addNode(repo) {
    adjacencyList.set(repo, []);
}

function addEdge(origin, destination) {
    adjacencyList.get(origin).push(destination);
    adjacencyList.get(destination).push(origin);
}

function constructGraph(arrayOfRepos){
    const repos = arrayOfRepos.map(repo => repo.name);
    repos.forEach(addNode);
    return adjacencyList;
}

export default constructGraph;