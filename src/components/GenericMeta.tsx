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
			<meta property="og:url" content="https://aghea.vercel.app/" />
			<meta property="og:site_name" content={title}/>
			<meta property="twitter:image" content="https://yt3.googleusercontent.com/h5FkDfQ6rWOKwyJ1ncmAU2nh0v0Kv6QjzxZv4-QdoK8P8zZSbOLyBAlYKsv7MN05rNWZ1Tzmaw=s176-c-k-c0x00ffffff-no-rj"/>
			<meta property="twitter:title" content={title}/>
      <meta property="twitter:description" content={description}/>
		</Head>
	);
}
