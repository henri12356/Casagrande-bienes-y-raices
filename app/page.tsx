import Footer from "./footer";
import Formulario from "./formulario";
import HeroCarousel from "./hero";
import Navbar from "./navbar";
import Sobrenosotros from "./sobrenosotros";

export default function Home() {
  return (
    <div>
      <Navbar />
     <HeroCarousel />
     <Formulario />
      <Footer />
    </div>
  );
}
