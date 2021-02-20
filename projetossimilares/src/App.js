import { useState } from 'react';
import './App.css';
import constructGraph from './utils/constructGraph';
import axios from 'axios';

function App() {

  let repos = [];
  const [inicialDate, setInicialDate] = useState('');
  const [finalDate, setFinalDate] = useState('');
  const [organization, setOrganization] = useState('');

  async function fetchData(e) {
    e.preventDefault();
    let response = await axios.get(`https://api.github.com/orgs/${organization}/repos?per_page=100`);
    let next;
    if (response.headers.link) {
      next = parseData(response.headers.link).next;
    }
    repos = repos.concat(response.data);

    while (next) {
      response = await axios.get(next);
      next = parseData(response.headers.link).next;
      repos = repos.concat(response.data);
    }

    renderRepos();
  }

  function parseData(data) {
    let arrData = data.split("link:")
    data = arrData.length === 2 ? arrData[1] : data;
    let parsed_data = {}

    arrData = data.split(",")

    for (var d of arrData) {
      var linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/ig.exec(d)

      parsed_data[linkInfo[2]] = linkInfo[1]
    }

    return parsed_data;
  }

  async function renderRepos() {
    let filteredRepos;
    let languages;
    let mappedRepos = [];
    if (inicialDate && finalDate) {
      filteredRepos = repos.filter(repo => {
        const createdAt = repo["created_at"].slice(0, 10);
        if (createdAt >= inicialDate && createdAt <= finalDate) {
          return true;
        }
        return false;
      });
    }
    else{
      filteredRepos = repos;
    }
    for (let repo of filteredRepos) {
      const response = await axios.get(repo.languages_url);
      languages = Object.keys(response.data);
      mappedRepos.push({name: repo.name, languages: languages})
    }
    constructGraph(mappedRepos);
  }

  return (
    <div className="App">
      <div className="form-container">
        <form>
          <div className="forminput">
            <label htmlFor="organization">Nome exato da organização:</label>
            <input
              type="text"
              name="organization"
              id="organization"
              placeholder="Nome da Organização"
              value={organization}
              onChange={(e) => { setOrganization(e.target.value) }}
            />
          </div>
          <div className="forminput">
            <label htmlFor="inicialDate">Data inicial:</label>
            <input
              type="date"
              name="inicialDate"
              id="inicialDate"
              placeholder="Data inicial"
              value={inicialDate}
              onChange={(e) => { setInicialDate(e.target.value) }}
            />
          </div>

          <div className="forminput">
            <label htmlFor="finalDate">Data final:</label>
            <input
              type="date"
              name="finalDate"
              id="finalDate"
              placeholder="Data final"
              value={finalDate}
              onChange={(e) => { setFinalDate(e.target.value) }}
            />
          </div>

          <button type="submit" onClick={fetchData}>Gerar grafo</button>
        </form>
      </div>
      <div id="cy"></div>
    </div>
  );
}

export default App;
