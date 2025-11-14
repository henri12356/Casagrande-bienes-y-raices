import Blog from "./blog";
import Casas from "./casas";
import Comentario from "./comemtario";
import Footer from "./footer";
import Formulario from "./formulario";
import Gana from "./gana";
import HeroCarousel from "./hero";
import Navbar from "./navbar";
import Proyectos from "./proyectos";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroCarousel />
      <Proyectos />
      <Casas />
      <Comentario />
      <Gana />
      <Formulario />
      <Blog />
      <Footer />
    </div>
  );
}
