import Footer from "../footer";
import Navbar from "../navbar";
import Beneficios from "./beneficios";
import Hero from "./hero";
import Historia from "./histora";
import Mapa from "./mapa";


export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
     <Beneficios />
     <Mapa />
    <Historia / >
      <Footer />
    </div>
  );
}
