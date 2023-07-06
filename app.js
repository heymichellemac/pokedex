const pokedex = document.getElementById("pokedex");

const fetchPokemon = () => {
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
      const pokemon = results.map((result, index) => ({
        name: result.name,
        image: result.sprites["front_default"],
        type: result.types.map((type) => type.type.name).join(", "),
        id: result.id,
        generation: generationResults[index].generation.name.substring(11),
      }));
      displayPokemon(pokemon);
    });
  });
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

fetchPokemon();
