import './App.css';
import { QueryClientProvider, QueryClient, useQuery } from "react-query"
import axios from "axios"

const QueryStuff = () => {
  const queryInfo = useQuery('pokemon', () => 
    axios
      .get("https://pokeapi.co/api/v2/pokemon/")
      .then(res => res.data.results)
  )

  console.log(queryInfo)

  return queryInfo.data.map(pokemon => 
  <div>
    {pokemon.name}
  </div>
  )
}

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <QueryStuff />
    </QueryClientProvider>
  );
}
