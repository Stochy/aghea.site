import Head from "next/head";

interface GenericMetaProps {
	title: string;
	description: string;
}

export default function GenericMeta({ title, description }: GenericMetaProps) {
	return (
		<Head>
			<title>{title}</title>
			<meta property="og:title" content={title} />
			<meta name="description" content={description} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content="https://aghea.site/" />
			<meta property="og:image" content="https://yt3.googleusercontent.com/h5FkDfQ6rWOKwyJ1ncmAU2nh0v0Kv6QjzxZv4-QdoK8P8zZSbOLyBAlYKsv7MN05rNWZ1Tzmaw=s176-c-k-c0x00ffffff-no-rj" />
			<meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="aghea.site" />
      <meta name="twitter:creator" content="@agcrisbp" />
      <meta name="google-adsense-account" content="ca-pub-5238358527901368" />
		</Head>
	);
}
