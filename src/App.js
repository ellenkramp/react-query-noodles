import "./App.css";
import { useState } from "react";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import axios, { CancelToken } from "axios";

const PokemonSearch = ({ pokemon }) => {
  const queryInfo = useQuery(
    pokemon,
    () => {
      const source = CancelToken.source();

      const promise = new Promise(resolve => setTimeout(resolve, 1000))
        .then(() =>
          axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`, {
            cancelToken: source.token,
          })
        )
        .then(res => res.data);

      promise.cancel = () => source.cancel("canceled");
      return promise;
    },
    { enabled: !!pokemon }
  );

  const { isLoading, isSuccess, data } = queryInfo;
  return isLoading ? (
    "loading"
  ) : isSuccess && data && data.sprites ? (
    <img src={data.sprites?.front_shiny} alt={pokemon} />
  ) : (
    "Type something"
  );
};

export default function App() {
  const queryClient = new QueryClient();

  const [pokemon, setPokemon] = useState("");

  const updatePokemonInput = newPokemon => {
    setPokemon(newPokemon);
  };

  return (
    <QueryClientProvider client={queryClient}>
      PokemonSearch
      <input
        value={pokemon}
        onChange={e => updatePokemonInput(e.target.value)}
      />
      <PokemonSearch pokemon={pokemon} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
