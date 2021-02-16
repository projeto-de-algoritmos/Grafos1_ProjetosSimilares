import { useEffect, useState } from 'react';
import './App.css';
import constructGraph from './utils/constructGraph';
import axios from 'axios';

function App() {

  // const [repoCount, setRepoCount] = useState(0);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let response = await axios.get('https://api.github.com/orgs/gotaBR/repos?per_page=100');
      let next;
      if (response.headers.link) {
        next = parseData(response.headers.link).next;
      }
      setRepos(repos.concat(response.data));
      
      while (next) {
        response = await axios.get(next);
        next = parseData(response.headers.link).next;
        setRepos(repos.concat(response.data));
      }
    }
    fetchData();
    
  }, []);

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

  function renderRepos(){
    constructGraph(repos);
  }

  return (
    <div className="App">
      <button onClick={renderRepos}>Clique para renderizar o grafo</button>
      <div id="cy"></div>
    </div>
  );
}

export default App;
