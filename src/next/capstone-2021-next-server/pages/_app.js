import React from 'react';
import { ApolloProvider } from '@apollo/client';
import withApolloClient from '../libs/client'
import Head from 'next/head';
// MUI Core
import { ThemeProvider as MaterialUiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
// Utils
import { theme, lightTheme, darkTheme } from '../utils/theme';
import { global as GlobalStyles } from '../utils/global';
// Redux
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from "../src/modules";
import Cookies from 'js-cookie';
import ThemeToggleBtn from "../src/components/ThemeToggleBtn";
import '../styles/bubble.css';

const store = createStore(reducer, composeWithDevTools(applyMiddleware()))

const App = ({ Component, pageProps, apollo }) => {
    const [ toggle, setToggle ] = React.useState(Cookies.get('dove-dark-mode'));
    const toggleTheme = async () => {
        const toggled = !toggle;
        await new Promise((resolve) => {
            Cookies.set('dove-dark-mode', toggled);
            resolve(true);
        }).then(() => setToggle(toggled))
    }

    return (
        <Provider store={store}>
            <ApolloProvider client={apollo}>
                <Head>
                    <title>Hiing</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                </Head>
                <MaterialUiThemeProvider theme={theme}>
                    <StyledThemeProvider theme={toggle ? darkTheme : lightTheme}>
                        <ThemeToggleBtn toggle={toggle} modifyTheme={toggleTheme} />
                        <GlobalStyles />
                        <Component {...pageProps} />
                    </StyledThemeProvider>
                </MaterialUiThemeProvider>
            </ApolloProvider>
        </Provider>
    )
}

export const getServerSideProps = async ({ ctx, Component }) => {
    const pageProps = await Component.getStaticProps?.(ctx);
    return { props: { ...pageProps } }
}

export const getInitialProps = async ({ Component, router, ctx }) => {
    let pageProps = { };
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
}

export default withApolloClient(App);