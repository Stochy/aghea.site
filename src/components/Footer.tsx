import Image from "next/future/image";

export default function Footer() {
  return (
    <footer className="text-white text-center py-4">
      <hr className="mb-4 bg-slate-800 border-none h-0.5" />
      <p className="text-sm opacity-75 flex justify-center items-center gap-2">
        Powered by{' '}
        <a
          href="https://github.com/agcrisbp/ADPortfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Image src="/images/nextjs.svg" width={65} height={65} alt="Next.js Logo" />
        </a>
      </p>
    </footer>
  );
}