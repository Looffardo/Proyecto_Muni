import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  // Mostrar el footer únicamente en las páginas de inicio
  const showFooter = [
    "/gescom",
    "/area",
  ].includes(location.pathname);

  if (!showFooter) {
    return null;
  }

  return (
    <footer className="footer">

      <div>
        <h3>Requerimientos Peñalolén</h3>

        <p>
          Plataforma para el registro y seguimiento
          de problemáticas territoriales de la comuna.
        </p>
      </div>

      <div>
        <p>Proyecto de Ingeniería de Software</p>
        <p>2026</p>
      </div>

    </footer>
  );
}

export default Footer;