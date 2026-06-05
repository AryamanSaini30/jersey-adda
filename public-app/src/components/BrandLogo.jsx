export default function BrandLogo({ className = '', showWordmark = true, compact = false, tone = 'light' }) {
  const logoSizeClass = compact ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-10 w-10 sm:h-12 sm:w-12';
  const titleClass = tone === 'dark' ? 'text-white' : 'text-charcoal';
  const subtitleClass = tone === 'dark' ? 'text-gray-300' : 'text-brand-600';
  const logoUrl = 'https://res.cloudinary.com/dlnf5iam6/image/upload/v1780690665/WhatsApp_Image_2026-06-06_at_01.36.22_pvwztm.jpg';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`.trim()}>
      <img
        src={logoUrl}
        alt="Jersey Adda logo"
        className={`${logoSizeClass} rounded-full object-contain bg-white shrink-0 shadow-sm`}
      />
      {showWordmark ? (
        <div className="block">
          <h1 className={`text-base sm:text-xl font-heading font-extrabold uppercase tracking-wider leading-none sm:leading-tight ${titleClass}`}>Jersey Adda</h1>
          {!compact ? <p className={`text-[8px] sm:text-[10px] font-sans font-bold tracking-widest uppercase ${subtitleClass} mt-0.5 sm:mt-0`}>Premium Store</p> : null}
        </div>
      ) : null}
    </div>
  );
}
