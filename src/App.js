import "./App.css";
import { useEffect, useState } from "react";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import axios from "axios";

const fetchPosts = (_, { page }) =>
  axios
    .get(`https://jsonplaceholder.typicode.com/posts`, {
      // params: {
      //   pageSize: 10,
      //   pageOffset: page,
      // },
    })
    .then(res => res.data);

const Posts = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  const [page, setPage] = useState(1);

  const postsQuery = useQuery(["posts", { page }], fetchPosts);

  useEffect(() => {
    queryClient.prefetchQuery(
      ["posts", { page: postsQuery.latestData?.nextPageOffset }],
      fetchPosts
    );
  }, [postsQuery]);

  return postsQuery.isLoading ? (
    "Loading.."
  ) : (
    <div>
      <br />
      <nr />
      {postsQuery.isLoading || postsQuery.isIdle ? (
        "Loading posts"
      ) : (
        <div>Post count: {postsQuery.data?.length}</div>
      )}
      <button onClick={() => setPage(old => old - 1)}>Previous</button>
      <span>Current page: {page}</span>
      <button onClick={() => setPage(old => old - 1)}>Next</button>
    </div>
  );
};

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Posts />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
