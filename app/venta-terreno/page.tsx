import Footer from "../footer";
import Formulario from "../formulario";
import Navbar from "../navbar";
import FormularioVentaTerreno from "./formulario";

export default function Home() {
  return (
    <div>
      <Navbar />
       <FormularioVentaTerreno />

      <Footer />
    </div>
  );
}
