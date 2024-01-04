import "../styles/index.scss";

import type { AppProps } from "next/app";
import Head from "next/head";

import Layout from "../components/Layout";

import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Agcrismanto Budhi Praswastyka</title>

				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<meta name="theme-color" content="#000000" />

				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
			</Head>
			<Layout>
				<Component {...pageProps} />
				<Analytics />
			</Layout>
		</>
	);
}

export default MyApp;
