import "./App.css";
import Link from "next/link"
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import axios from "axios";

const fetchPosts = () =>
  axios
    .get(`https://jsonplaceholder.typicode.com/posts`)
    .then(res => res.data);

  export const getServerSideProps = async () => {
    const posts = await fetchPosts();

    return {
      props: { posts },
    };
  };

  const Posts = (props) => {
    console.log(props);
    // nextjs isn't set up properly but there should be posts as props

    const postsQuery = useQuery("posts", fetchPosts);

    return postsQuery.isLoading ? (
      "Loading.."
    ) : postsQuery.data ? (
      <div>
        <br />
        <br />
        {postsQuery.isLoading || postsQuery.isIdle ? (
          "Loading posts"
        ) : (
          <ul>
            <h1>List</h1>
            {postsQuery.data?.map(el => ( ( ( ( (
              <li key={el.title}>{el.title}</li>
            ))))))}
          </ul>
        )}
        <Link href="/">link</Link>
      </div>
    ) : (
      ""
    );
  };

export default function App(props) {
console.log("real root props", props)
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Posts />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
