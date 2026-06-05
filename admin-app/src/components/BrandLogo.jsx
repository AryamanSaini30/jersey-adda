export default function BrandLogo({ className = '', showWordmark = true, sizeClass = 'h-4 w-4' }) {
  const logoUrl = 'https://res.cloudinary.com/dlnf5iam6/image/upload/w_80,h_80,c_fill/WhatsApp_Image_2026-06-06_at_01.36.22_pvwztm.jpg';

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <img
        src={logoUrl}
        alt="Jersey Adda logo"
        className={`${sizeClass} rounded-full object-contain bg-white shrink-0 shadow-sm`}
      />
      {showWordmark ? (
        <span className="brand-copy">
          <strong>Jersey Adda Admin</strong>
          <small>Separate dashboard</small>
        </span>
      ) : null}
    </div>
  );
}
