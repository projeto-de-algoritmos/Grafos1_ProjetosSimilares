import { useEffect, useState } from 'react';
import './App.css';
import cytoscape from 'cytoscape';
//import api from './services/api';
import axios from 'axios';

function App() {

  const [repoCount, setRepoCount] = useState(0);
  let repos = [];

  useEffect(() => {
    var cy = cytoscape({

      container: document.getElementById('cy'), // container to render in

      elements: [ // list of graph elements to start with
        { // node a
          data: { id: 'a' }
        },
        { // node b
          data: { id: 'b' }
        },
        { // edge ab
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],

      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'none',
            'curve-style': 'haystack, demo'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      }

    });
  }, []);

  useEffect(async () => {
    let response = await axios.get('https://api.github.com/orgs/projeto-de-algoritmos/repos?per_page=100');
    let {next} = parseData(response.headers.link);
    repos = repos.concat(response.data);
    while(next){
      response = await axios.get(next);
      next = parseData(response.headers.link).next;
      repos = repos.concat(response.data);
    }
    console.log(repos);    
  }, []);

  function parseData(data) {
    let arrData = data.split("link:")
    data = arrData.length == 2? arrData[1]: data;
    let parsed_data = {}

    arrData = data.split(",")

    for (var d of arrData){
        var linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/ig.exec(d)

        parsed_data[linkInfo[2]]=linkInfo[1]
    }

    return parsed_data;
}

  /*useEffect(() => {
    api.get(`repos?per_page=100&page=${(repoCount / 100)}`).then((response2) => {
      setRepos(...repos, response2.data);
    });
    setRepoCount(repoCount-100);
    console.log(repos);
  }, [repoCount])*/
  

  return (
    <div className="App">
      <div id="cy"></div>
    </div>
  );
}

export default App;
