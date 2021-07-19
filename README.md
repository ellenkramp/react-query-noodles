# Getting Started with React Query
This library helps to manage data being fetched and updated through query and mutation hooks

## Setup [Full Docs](https://react-query.tanstack.com/quick-start)

- Need to create a client and provider and wrap your app in the provider, passing in the client

Example:

```// Create a client
 const queryClient = new QueryClient()
 
 function App() {
   return (
     // Provide the client to your App
     <QueryClientProvider client={queryClient}>
       <Todos />
     </QueryClientProvider>
   )
 }
 ```

## Queries [Docs](https://react-query.tanstack.com/guides/queries)

Queries are any request to get data

### How to query
```
const request = fetch(url, {})
const query = useQuery(NAME_OF_QUERY`, request, {CONFIG_OPTIONS})
```

### Query keys [Docs](https://react-query.tanstack.com/guides/query-keys)

- Can be dynamic
- Can be arrays for more specific keys
- Can pass a prop in to make differentiated keys

### Config Options
An object passed in as the 3rd param of useQuery

Defaults to refetch stale data on window focus, but can negate that with config options

Examples of options:

```
{ refetchOnWindowFocus: false }
{ cacheTime: INT in ms } or can do Infinity
{ retry: INT } number of automatic retries
{ retryDelay: INT in ms } can configure custom retry delay
{ initialData: {} } anything that can supplement data so that it does not need to fetch data the first time it mounts the component
{ initialStale: boolean } if true, will fetch data as soon as component mounts
{ refetchInterval: INT ms } how often to refetch data - it only refetches while tab is in focus
{ refetchIntervalInBackground: boolean } set to true, if you want it to refetch when the tab is not in focus
```

### Query Statuses

Helpful statuses that come baked into queries

Examples:

query
.isLoading
.isError
.isSuccess
.isFetching

### QueryCache

- Use data from one query as initial data for another

Functional form of initialData config:

`initialData: () => queryCache.getQueryData(QUERY_KEY)`

- Can add .find(id === id) to match up initial data from array and individual

`{ initialStale: boolean }` set true to update in background

- `queryCache.setQueryData(QUERY_KEY, data)`

- data is always fetched in background with this method as it is considered ‘stale’ immediately
    

#### Pre-fetching

`.prefetchQuery(QUERY_KEY, () => fn to fetch data)`
 - load data before component is mounted

- On hover or `onMouseEnter` can set to prefetch
- Can use many similar options to regular query
- `{ staleTime: INT }` ms or Infinity (then it will only prefetch once) }
- Can also use `{ force: true }` object (separate from config options, those would be null here
    - example: `queryCache.prefetchQuery(QUERY_KEY, () => fnToFetchData, null, { force: true} )`
    - Fourth object is unique to querycache
        - You shouldn’t have to use this often and override “stale” quality

#### Invalidate Queries

- Manually invalidates data and triggers a refetch
	`queryCache.invalidateQueries(QUERY_NAME)`
- `{ refetchActive: false }` makes it so it won’t do an immediate refetch
- Invalidated queries that aren’t in use will not refetch, unless you change the refetchInactive config

InvalidateQueries Options Config:
`{ refetchActive: false }`
`{ refetchInactive: true }` - can set this to true to refetch queries not currently mounted

### Paginated Queries [Docs](https://react-query.tanstack.com/guides/paginated-queries)

`usePaginatedQuery`
-as the key changes, it keeps the old data around
- Query methods change to:
    - `.resolvedData`
    - `.latestData`
    - `.latestData.nextPageOffset` to see if there is another page
     - If this `nextPageOffset` exists, it’s a good indication that you can prefetch the next page
     - Use `useEffect() {}`
￼
#### Infinite Query [Docs](https://react-query.tanstack.com/guides/infinite-queries)

`Const query = useInfiniteQuery()`

`Query.data` comes back as an array of arrays to mimic pagination

Must pass in `{ getFetchMore}` 

Example: 
	- `useInfiniteQuery("posts", fetchPosts, {
    getFetchMore: (lastPage, allPages) => lastPage.items.nextPageOffset
  })`
- Getfetchmore will add to the end of the existing data
- Disable pagination using info from original query
- `Canfetchmore` as boolean

Refetches happen as would normally, up to the page that you’re currently at

- Can pass in new query id’s as pages are incremented so that individual pages become invalidated


### Mutations [Docs](https://react-query.tanstack.com/guides/mutations)

- use many of the same features of queries, but used for update, create, and delete functionality

## Cool Features

### Caching

- React query caches data automatically
- Refetches in background

### Side Effects
```
onSuccess: (data) => { do what you want with it }

onError: (error) =>

onSettled(data, error) => (it’s done, whether success or error) 
```

**Gets called for every single query instance across application, not just once

For functionality that should not be duplicated, do it inside the function where the call is made

### Dependent Queries [Docs](https://react-query.tanstack.com/guides/dependent-queries)

- Launching a query dependent on the success of a previous query
- Start in an ‘isIdle’ state as opposed to ‘isLoading’

### Cancel fetching

- AXIOS
```
      	const source = CancelToken.source();
	const promise.cancel = () => source.cancel(“message”)
	pass in { cancelToken: source.token } for axios options
```
- FETCH API
```
	const controller = new AbortController()
	const signal = controller.signal
Const promise.cancel = () => controller.abort()
	pass in { signal } for fetch options
```

### Failure handling
- Automatic retry 3 times with exponential backoff - every time it tries, it will get a little longer
    - Can also configure retryDelay to a custom time in ms
- Can configure retry count
- Stays in a “loading” state until final retry

### React Query Devtools [Docs](https://react-query.tanstack.com/devtools)
- used for debugging and viewing queries and data cache
`import { ReactQueryDevtools } from 'react-query/devtools'`
- This is a renderable component that should be rendered as high up in the tree as possible

### Scroll Restoration
- based on forward/backward navigation in browser
- Using the back button takes you back to the exact place on the page that you were
- Dependent on cachetime... if you don't have a very long cachetime, it won't "remember"
