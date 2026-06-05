import BrandLogo from './BrandLogo';

export default function BrandHeader({ onNavigatePublic }) {
  return (
    <header className="topbar">
      <button className="brand" type="button">
        <BrandLogo showWordmark={false} sizeClass="h-4 w-4" className="gap-2" />
      </button>

      <nav className="topnav">
        <button className="topnav__button" type="button" onClick={() => window.location.assign('/settings')}>
          Phone Number
        </button>
        <button className="topnav__button" type="button" onClick={onNavigatePublic}>
          Public site
        </button>
      </nav>
    </header>
  );
}
