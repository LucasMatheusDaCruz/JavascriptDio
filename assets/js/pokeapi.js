// Define a URL base para a PokeAPI
const baseUrl = 'https://pokeapi.co/api/v2'

// Cria um objeto para a PokeAPI com um método assíncrono chamado `getPokemons`
const pokeApi = {
  async getPokemons(offset, limit) {
    // Monta a URL com base no offset e limit passados como parâmetro
    const url = `${baseUrl}/pokemon?offset=${offset}&limit=${limit}`

    // Faz uma requisição HTTP para a PokeAPI usando a URL montada
    const response = await fetch(url)

    // Verifica se a requisição HTTP foi bem sucedida
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Converte a resposta HTTP em um objeto JSON
    const data = await response.json()

    // Mapeia os resultados da resposta para buscar mais informações de cada Pokemon
    const pokemons = data.results.map(async (result) => {
      // Faz uma nova requisição HTTP para buscar mais informações de um Pokemon específico
      const pokemonResponse = await fetch(result.url)

      // Verifica se a requisição HTTP foi bem sucedida
      if (!pokemonResponse.ok) {
        throw new Error(`HTTP error! status: ${pokemonResponse.status}`)
      }

      // Converte a resposta HTTP em um objeto JSON
      const pokemonData = await pokemonResponse.json()

      // Extrai algumas informações úteis do objeto JSON
      const { id, name, types, sprites } = pokemonData

      // Formata o ID do Pokemon como uma string de 3 dígitos com zeros à esquerda, se necessário
      const number = id.toString().padStart(3, '0')

      // Pega a URL da imagem do Pokemon a partir do objeto JSON
      const photo = sprites.front_default

      // Retorna um objeto com as informações do Pokemon formatadas
      return { id, number, name, types: types.map((type) => type.type.name), photo }
    })

    // Espera todas as requisições assíncronas terminarem e retorna uma lista com as informações de todos os Pokemons
    return Promise.all(pokemons)
  }
}
