import Footer from "../footer";
import Navbar from "../navbar";
import PanelComercial from "./panel-comercial";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="pt-36">


            <PanelComercial />
      </div>

      <Footer />
    </div>
  );
}
