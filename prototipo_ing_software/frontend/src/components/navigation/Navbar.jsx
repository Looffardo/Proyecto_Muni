import { Link } from "react-router-dom";
import logoPenalolen from "../../assets/logos/logo-penalolen.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img
          src={logoPenalolen}
          alt="Municipalidad de Peñalolén"
          className="navbar-logo-img"
        />

        <h2>Solicitudes Barriales</h2>
      </div>

      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/mapa">Mapa</Link>
        <Link to="/requerimientos">Mis requerimientos</Link>
        <Link to="/nuevo">Reportar problema</Link>
      </div>

      <div className="navbar-user">
        <button>Mi cuenta</button>
      </div>
    </nav>
  );
}

export default Navbar;