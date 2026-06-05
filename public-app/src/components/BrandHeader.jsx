export default function BrandHeader({ onNavigateHome }) {
  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={onNavigateHome}>
        <span className="brand-mark">JA</span>
        <span className="brand-copy">
          <strong>Jersey Adda</strong>
          <small>Public storefront</small>
        </span>
      </button>

      <nav className="topnav">
        <button className="topnav__button" type="button" onClick={onNavigateHome}>
          Catalog
        </button>
      </nav>
    </header>
  );
}
