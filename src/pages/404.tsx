import Link from "next/link";
import GenericMeta from "../components/GenericMeta";

export default function Custom404() {
	return (
		<>
			<GenericMeta
				title="404 - Page not found."
				description="It looks like the page you are looking for does not exist. Please come back!"
			/>
			<h1 className="mb-2 heading text-amber-400">
				404 &ndash; Page not found.
			</h1>
			<p>
				It looks like the page you are looking for does not exist. Please{" "}
				<Link href="/">
					<a className="border-b border-[#fff4] hover:border-white transition">
						return
					</a>
				</Link>
				!
			</p>
		</>
	);
}
