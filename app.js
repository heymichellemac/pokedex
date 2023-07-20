const pokedex = document.getElementById("pokedex");
let pokemon = [];
let filteredPokemon = [];

const fetchPokemon = () => {
  const generationUrl = "https://pokeapi.co/api/v2/generation";

  fetch(generationUrl)
    .then((res) => res.json())
    .then((generationData) => {
      const generations = generationData.results.slice(0, 1);
      const generationButtons = generations.map((generation) => {
        const generationName = generation.name.substring(11);
        return `<button class="filter-button bg-violet-500 hover:bg-violet-600 px-4 py-2 rounded-md font-medium text-white shadow-sm text-sm transition-all uppercase" data-generation="${generationName}">GEN ${generationName}</button>`;
      });

      const filterButtonsContainer = document.getElementById("filter-buttons");
      filterButtonsContainer.innerHTML = generationButtons.join("");

      addFilterListeners();

      const promises = [];
      for (let i = 1; i <= 151; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
      }
      Promise.all(promises).then((results) => {
        const pokemonPromises = results.map((result) => {
          const generationUrl = result.species.url;
          return fetch(generationUrl).then((res) => res.json());
        });

        Promise.all(pokemonPromises).then((generationResults) => {
          pokemon = results.map((result, index) => ({
            name: result.name,
            image: result.sprites["front_default"],
            type: result.types.map((type) => type.type.name).join(", "),
            id: result.id,
            generation: generationResults[index].generation.name.substring(11),
          }));
          filteredPokemon = [...pokemon]; // Set filteredPokemon to complete list initially
          displayPokemon(filteredPokemon);
        });
      });
    });
};

const filterPokemonByGeneration = (generation) => {
  filteredPokemon = pokemon.filter(
    (pokeman) => pokeman.generation === generation
  );
  displayPokemon(filteredPokemon);
};

const displayPokemon = (pokemon) => {
  console.log(pokemon);
  const pokemonHTMLString = pokemon
    .map(
      (pokeman) => `
        <div class="bg-slate-700 rounded-md py-2 text-white flex flex-col gap-y-1 items-center capitalize relative">
            <div class="absolute left-3 top-2 text-lg font-semi-bold">#${pokeman.id}</div>

            <img class="w-32" src="${pokeman.image}"/>        
            <h2 class="text-2xl font-medium mb-3">${pokeman.name}</h2>
            <div class="uppercase text-sm bg-violet-500 px-2 py-1 rounded-md mb-4">Gen ${pokeman.generation}</div>
        </div>
    `
    )
    .join("");
  pokedex.innerHTML = pokemonHTMLString;
};

const addFilterListeners = () => {
  const filterButtons = document.querySelectorAll(".filter-button");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedGeneration = button.dataset.generation;
      filterPokemonByGeneration(selectedGeneration);
    });
  });
};

fetchPokemon();
