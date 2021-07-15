// import React from 'react';
import { UserProvider } from '@zeushq/nextjs-zauth';

export default function App({ Component, pageProps }) {
    // If you've used `withAuth`, pageProps.user can pre-populate the hook
    // if you haven't used `withAuth`, pageProps.user is undefined so the hook
    // fetches the user from the API routes
    const { user } = pageProps;

    return (
        <UserProvider user={user}>
            <Component {...pageProps} />
        </UserProvider>
    );
}