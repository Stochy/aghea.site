// components/Layout.tsx
import Navbar from "./Navbar";
import Transition from "./Transition";
import Footer from "./Footer";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="md:container md:px-0 mx-auto px-8 text-white text-xl flex-grow">
        <Navbar />
        <main>
          <Transition>{children}</Transition>
        </main>
        <Footer />
      </div>
      
    </div>
  );
}