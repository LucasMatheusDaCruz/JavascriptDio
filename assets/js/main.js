// Obtém o elemento de input e o botão de busca
const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchButton')

// Adiciona um ouvinte de eventos para o botão de busca
searchButton.addEventListener('click', () => {
  // Obtém o valor do campo de busca
  const searchTerm = searchInput.value.trim()

  // Verifica se o campo de busca está vazio
  if (searchTerm === '') {
    alert('Por favor, digite um nome ou código de Pokemon.')
    return
  }

  // Chama a API para obter todos os Pokemons
  pokeApi.getPokemons(0, maxRecords).then((pokemons = []) => {
    // Filtra os resultados com base no código ou nome fornecido pelo usuário
    const filteredPokemons = pokemons.filter((pokemon) => {
      return pokemon.id.toString() === searchTerm || pokemon.name.toLowerCase() === searchTerm.toLowerCase()
    })

    // Verifica se há resultados
    if (filteredPokemons.length === 0) {
      alert(`Não foi possível encontrar nenhum Pokemon com o nome ou código "${searchTerm}".`)
      return
    }

    // Limpa a lista de Pokemons existente
    pokemonList.innerHTML = ''

    // Converte os pokemons filtrados para elementos HTML e adiciona à lista
    const newHtml = filteredPokemons.map(convertPokemonToLi).join('')
    pokemonList.innerHTML = newHtml
  })
})


// Obtém o elemento da lista de pokemons e o botão de "carregar mais"
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

// Define a quantidade máxima de registros que serão exibidos e a quantidade de registros carregados a cada vez
const maxRecords = 1158
const limit = 10

// Define o índice inicial para a listagem de pokemons
let offset = 0;

// Função para converter um pokemon em um elemento de lista
function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.types[0]}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

// Função para carregar itens da lista de pokemons
function loadPokemonItens(offset, limit) {
    // Chama a API para obter os pokemons com base no índice e limite informados
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        // Converte os pokemons para elementos HTML e adiciona à lista
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

// Carrega os primeiros itens da lista de pokemons
loadPokemonItens(offset, limit)

// Adiciona um evento ao botão de "carregar mais" para carregar mais itens
loadMoreButton.addEventListener('click', () => {
    // Incrementa o índice de offset para carregar a próxima página de itens
    offset += limit
    // Verifica se a quantidade de registros com a próxima página ultrapassa o máximo permitido
    const qtdRecordsWithNexPage = offset + limit
    if (qtdRecordsWithNexPage >= maxRecords) {
        // Se ultrapassar, define um novo limite para carregar apenas o restante de itens até o máximo
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        // Remove o botão de "carregar mais"
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        // Se não ultrapassar, carrega a próxima página de itens normalmente
        loadPokemonItens(offset, limit)
    }
})
