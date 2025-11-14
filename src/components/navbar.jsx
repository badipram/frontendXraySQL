import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1 className="logo-name">RekoMed</h1>
      </div>
      <button
        className="hamburger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      <ul className={`navbar-links${open ? " open" : ""}`}>
        <li>
          <Link to={{ pathname: "/", hash: "#home" }} onClick={() => setOpen(false)}>Beranda</Link>
        </li>
        <li>
          <Link to={{ pathname: "/", hash: "#about" }} onClick={() => setOpen(false)}>Tentang</Link>
        </li>
        <li>
          <Link to={{ pathname: "/", hash: "#technology" }} onClick={() => setOpen(false)}>Teknologi</Link>
        </li>
        <li><Link to="/rekonstruksi" onClick={() => setOpen(false)}>Konstruksi</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;