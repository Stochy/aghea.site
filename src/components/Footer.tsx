import Image from "next/future/image";

export default function Footer() {
  return (
    <footer className="text-center py-4">
      <hr className="mb-4 bg-slate-800 border-none h-0.5" />
      <p className="text-sm opacity-75 flex justify-center items-center gap-1">
        Powered by{' '}
        <a
          href="https://github.com/agcrisbp/aghea.site"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
          onContextMenu={(e) => e.preventDefault()}
        >
          <Image 
            src="/images/nextjs.svg" 
            width={50} 
            height={50} 
            alt="NextJS Logo" 
            // `className="invert dark:invert-0"` = For Next14. Remove `stroke="white" stroke-width="3"` in /images/nextjs.svg
            onContextMenu={(e) => e.preventDefault()}
          />
        </a>
      </p>
    </footer>
  );
}