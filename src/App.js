import "./App.css";
import { useEffect, useState } from "react";
import {
  QueryClientProvider,
  QueryClient,
  useInfiniteQuery,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import axios from "axios";

const fetchPosts = (_, page = 1) =>
  axios
    .get(`https://jsonplaceholder.typicode.com/posts`, {
      params: {
        pageSize: 10,
        pageOffset: page,
      },
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

  const postsQuery = useInfiniteQuery("posts", fetchPosts, {
    getFetchMore: (lastPage, allPages) => lastPage.items.nextPageOffset
  });

  useEffect(() => {
    queryClient.prefetchQuery(
      "posts",
      fetchPosts
    );
  }, []);

  return postsQuery.isLoading ? (
    "Loading.."
  ) : postsQuery.data? (
    <div>
      <br />
      <br />
      {postsQuery.isLoading || postsQuery.isIdle ? (
        "Loading posts"
      ) : (
        <ul>
          <h1>List</h1>
          {postsQuery.data.pages?.map(page => (
            page.map(el => <li>{el.title}</li>)
          ))}
        </ul>
      )}  
      <button onClick={() => postsQuery.fetchNextPage()}>Get more</button>
    </div>
  ): "";
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
