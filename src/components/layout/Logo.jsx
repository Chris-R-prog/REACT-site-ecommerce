import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="brand">
      <span className="brand-script">L'</span>
      <span className="brand-name">essentiel</span>
    </Link>
  );
}

export default Logo;
