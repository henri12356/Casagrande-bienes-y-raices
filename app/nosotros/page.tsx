import Footer from "../footer";
import Navbar from "../navbar";
import Beneficios from "./beneficios";
import Hero from "./hero";
import Mapa from "./mapa";


export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
     <Beneficios />
     <Mapa />
      <Footer />
    </div>
  );
}
