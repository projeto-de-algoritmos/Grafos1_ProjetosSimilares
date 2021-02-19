//------------------------------------------GRAFO--------------------------------------------------

// Implementando o grafo em forma de Lista de Adjacências:

const listaDeAdjacencias = new Map();

// Adicionar um nó/vértice ao grafo:
function adicionaNo(item) {
  listaDeAdjacencias.set(item, []); // O nó é criado vazio 
}

// Adicionar uma aresta (grafo não direcionado)
function adicionaAresta(origem, destino) {
  listaDeAdjacencias.get(origem).push(destino);
  listaDeAdjacencias.get(destino).push(origem);
}

// Inicializando o grafo de exemplo:
function criaGrafo(nos, arestas) {
  nos.forEach(adicionaNo);
  arestas.forEach(route => adicionaAresta(...route));
}

// Busca em Largura - BFS - Breadth First Search:
function procuraCiclo(começo) {
  const visitados = new Set();
  visitados.add(começo);
  const fila = [começo]; // A bfs começa no nó passado como inicial

  while (fila.length > 0) {
    const item = fila.shift(); // O elemento é tirado da fila

    const vizinhos = listaDeAdjacencias.get(item);

    for (const vizinho of vizinhos) {

      if (!visitados.has(vizinho)) {
        visitados.add(vizinho);
        fila.push(vizinho);
      }
      else{
        visitados.add(vizinho);
        console.log("É cíclico!");
        visitados.forEach(visitado => console.log(visitado));
        return;
      }
    }
  }
}


const nos = [1, 2, 3, 4, 5, 6];
const arestas = [ [1,2], [2,3], [3,4], [4,5], [5,6], [6,1] ];
criaGrafo(nos, arestas);
procuraCiclo(1);