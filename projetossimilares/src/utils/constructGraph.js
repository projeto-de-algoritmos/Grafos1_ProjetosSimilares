// const repos = ['Repo1', 'Repo2', 'Repo3']

// const routes = [
//     ['Repo1', 'Repo2'],
//     ['Repo3', 'Repo2'],
// ]

import renderGraph from './renderGraph';

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
  const graphOfLanguages = Array.from(adjListLanguages, ([name, value]) => ({ name, value }));
  const graphOfRepos = Array.from(adjListRepos, ([name, value]) => ({ name, value }));
  const languagesNodes = graphOfLanguages
    .map(repo => { return {data:{id: repo.name}, style:{'background-color': 'red'}}});
  const reposNodes = graphOfRepos
    .map(repo => { return {data:{id: repo.name}}});
  const edgesArray = graphOfRepos
    .map(repo => { return {data:{id:`${repo.name}-${repo.value}`, source: repo.name, target: repo.value}}} )
  const elements = [...languagesNodes, ...reposNodes, ...edgesArray];
  renderGraph({elements});
}

function constructGraph(arrayOfRepos) {
  const repos = arrayOfRepos.map(repo => { return { name: repo.name, language: repo.language } });
  repos.forEach(addNode);
  render();
}

export default constructGraph;