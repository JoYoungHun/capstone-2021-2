import ApolloClient, { InMemoryCache, NormalizedCacheObject, Operation} from 'apollo-boost'
import { withApollo } from 'next-with-apollo'
import { SERVER_ADDRESS } from "../src/env";
import Cookies from 'js-cookie'

export default withApollo(
    ({ initialState }: { initialState: NormalizedCacheObject }) =>
        new ApolloClient({
            cache: new InMemoryCache().restore(initialState || {}),
            uri: `${SERVER_ADDRESS}/graphql`,
            request: (operation: Operation) => {
                const token: string = Cookies.get('dove-token');
                operation.setContext({
                    headers: {
                        authorization: token ? `Bearer ${token}` : ''
                    }
                });
            },
        })
);