import Casas from "./casas";
import Comentario from "./comemtario";
import Footer from "./footer";
import Gana from "./gana";
import HeroCarousel from "./hero";
import Navbar from "./navbar";
import Proceso from "./proceso";
import Proyectos from "./proyectos";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroCarousel />
      <Proceso />
      <Proyectos />
       <Casas /> 
      <Comentario />
      <Gana />
      {/* <Formulario /> */}
      {/* <Blog /> */}
      <Footer />
    </div>
  );
}
