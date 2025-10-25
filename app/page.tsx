import Comentario from "./comemtario";
import Footer from "./footer";
import Formulario from "./formulario";
import HeroCarousel from "./hero";
import Navbar from "./navbar";
import Proyectos from "./proyectos";

export default function Home() {
  return (
    <div>
      <Navbar />
     <HeroCarousel />
     <Formulario />
     <Proyectos />
     <Comentario />
      <Footer />
    </div>
  );
}
