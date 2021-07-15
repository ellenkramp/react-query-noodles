import "./App.css";
import { useState } from "react";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import axios from "axios";

const email = "Sincere@april.biz";

const MyPosts = () => {
  const userQuery = useQuery("user", () =>
    axios
      .get(`https://jsonplaceholder.typicode.com/users?email=${email}`)
      .then(res => res.data[0])
  )

  const postsQuery = useQuery(
    "posts",
    () =>
      axios
        .get(
          `https://jsonplaceholder.typicode.com/posts?userId=${userQuery.data.id}`
        )
        .then(res => res.data),
    {
      enabled: !!userQuery.data?.id,
    }
  );

  return (
    userQuery.isLoading ? ("Loading user") :
    <div>
      User ID: {userQuery.data?.id}
      <br />
      <nr />
      {(postsQuery.isLoading || postsQuery.isIdle) ? (
        "Loading posts"
      ) : (
        <div>Post count: {postsQuery.data?.length}</div>
      )}
    </div>
  );
};

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MyPosts />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
