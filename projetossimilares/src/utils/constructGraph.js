import renderGraph from './renderGraph';

function compareName( a, b ) {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}

function compareValue( a, b ) {
  if ( a.value < b.value ){
    return -1;
  }
  if ( a.value > b.value ){
    return 1;
  }
  return 0;
}

const adjListLanguages = new Map();
const adjListRepos = new Map();

function addNode(repo) {
  adjListLanguages.set(repo.language, []);
  adjListRepos.set(repo.name, []);
  addEdge(repo.name, repo.language);
}

function addEdge(origin, destination) {
  adjListRepos.get(origin).push(destination);
  adjListLanguages.get(destination).push(origin);
}

function render() {
  const graphOfLanguages = Array.from(adjListLanguages, ([name, value]) => ({ name, value })).sort(compareName);
  const graphOfRepos = Array.from(adjListRepos, ([name, value]) => ({ name, value })).sort(compareValue);

  const languagesNodes = graphOfLanguages
    .filter(repo => repo.name)
    .map(repo => { return { data: { id: repo.name }, style: { 'background-color': 'red' } } });

  const reposNodes = graphOfRepos
    .map(repo => { return { data: { id: repo.name } } });

  const edgesArray = graphOfRepos
    .filter(repo => repo.value[0] !== null)
    .map(repo => { return { data: { id: `${repo.name}-${repo.value}`, source: repo.name, target: repo.value } } })

  const elements = [...languagesNodes, ...reposNodes, ...edgesArray];
  renderGraph({ elements });
}

function constructGraph(arrayOfRepos) {
  const repos = arrayOfRepos.map(repo => { return { name: repo.name, language: repo.language } });
  repos.forEach(addNode);
  render();
}

export default constructGraph;