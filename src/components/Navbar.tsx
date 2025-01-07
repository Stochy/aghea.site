import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import ActiveLink from "./ActiveLink";

interface PageData {
  href: string;
  title: string;
  icon: string;
  color: string;
}

const pages: PageData[] = [
  {
    href: "/",
    title: "Beranda",
    icon: "solar:home-outline",
    color: "text-orange-400",
  },
  {
    href: "/projects",
    title: "Projek",
    icon: "solar:programming-outline",
    color: "text-blue-400",
  },
  {
    href: "/blog",
    title: "Tulisan",
    icon: "solar:book-outline",
    color: "text-purple-400",
  },
  {
    href: "/music",
    title: "Musik",
    icon: "solar:airbuds-broken",
    color: "text-violet-400",
  },
];

export default function Navbar() {
	const [theme, setTheme] = useState<string>("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);

    if (savedTheme === "system") {
      const interval = setInterval(applySystemTheme, 1000);
      return () => clearInterval(interval);
    } else {
      applyTheme(savedTheme);
    }
  }, [theme]);

  const applyTheme = (theme: string) => {
    document.body.classList.toggle("dark", theme === "dark");
  };

  const applySystemTheme = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.toggle("dark", prefersDark);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    newTheme === "system" ? applySystemTheme() : applyTheme(newTheme);
  };

	return (
		<>
			<nav className="mb-12 flex flex-wrap items-center gap-x-8 font-bold">
				{pages.map(({ href, title, icon, color }) => (
					<ActiveLink
						href={href}
						key={href}
						activeClass="after:inset-x-0"
						nonActiveClass="after:opacity-0 after:inset-x-1/2 hover:after:opacity-100 hover:after:inset-x-1/4"
					>
						<a className="py-2 flex items-center relative after:absolute after:bottom-0 after:h-0.5 after:bg-white after:rounded after:transition-all">
							{title}
							<Icon icon={icon} className={`w-5 h-5 ml-2 ${color}`} />
						</a>
					</ActiveLink>
				))}
			</nav>

			<button onClick={toggleTheme} className="fixed bottom-6 right-6 p-4 z-50 p-4 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition-all flex items-center justify-center">
        <Icon icon={theme === "dark" ? "solar:moon-outline" : theme === "light" ? "solar:sun-outline" : "solar:laptop-bold"} width={20} height={20} />
        <span className="hidden md:block">{theme === "dark" ? "Dark Mode" : theme === "light" ? "Light Mode" : "System Mode"}</span>
      </button>
		</>
	);
}