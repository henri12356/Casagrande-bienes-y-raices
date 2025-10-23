import Footer from "./footer";
import HeroCarousel from "./hero";
import Navbar from "./navbar";
import Sobrenosotros from "./sobrenosotros";

export default function Home() {
  return (
    <div>
      <Navbar />
     <HeroCarousel />
     <Sobrenosotros />
      <Footer />
    </div>
  );
}
