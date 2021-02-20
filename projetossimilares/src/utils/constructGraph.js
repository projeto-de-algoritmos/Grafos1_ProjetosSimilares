import renderGraph from './renderGraph';

function compareName(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function compareValue(a, b) {
  if (a.value < b.value) {
    return -1;
  }
  if (a.value > b.value) {
    return 1;
  }
  return 0;
}

const adjListLanguages = new Map();
const adjListRepos = new Map();

function addNode(repo) {
  adjListRepos.set(repo.name, []);
  for (let language of repo.languages) {
    if(!adjListLanguages.get(language)){
      adjListLanguages.set(language, []);
    }
    addEdge(repo.name, language);
  }
}

function addEdge(origin, destination) {
  adjListRepos.get(origin).push(destination);
  adjListLanguages.get(destination).push(origin);
}

function render() {
  const graphOfLanguages = Array.from(adjListLanguages, ([name, value]) => ({ name, value })).sort(compareName);
  const graphOfRepos = Array.from(adjListRepos, ([name, value]) => ({ name, value })).sort(compareValue);
  let edgesArray = [];
  const languagesNodes = graphOfLanguages
    .filter(repo => repo.name)
    .map(repo => { return { data: { id: repo.name }, style: { 'background-color': '#531e5e' } } });

  const reposNodes = graphOfRepos
    .map(repo => { return { data: { id: repo.name } } });

  graphOfRepos
    .filter(repo => repo.value[0] !== null)
    .forEach(repo => {
      edgesArray = edgesArray.concat((
        repo.value.map(language => {
          return {
            data: {
              id: `${repo.name}-${language}`,
              source: repo.name,
              target: language
            }
          }
        })
      ));
      
    })

  const elements = [...languagesNodes, ...reposNodes, ...edgesArray];
  renderGraph({ elements });
}

function constructGraph(arrayOfRepos) {
  arrayOfRepos.forEach(addNode);
  console.log(adjListLanguages);
  console.log(adjListRepos);
  render();
}

export default constructGraph;