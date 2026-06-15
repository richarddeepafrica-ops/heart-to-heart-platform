const footerLinks = [
  ["Donate", "/donate"],
  ["Campaigns", "/campaigns"],
  ["Events", "/events"],
  ["Impact", "/impact"],
  ["Team", "/team"],
  ["Partners", "/partners"],
  ["Corporate Giving", "/corporate"]
];

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div>
        <img src="/assets/heart-to-heart-logo.svg" alt="Heart to Heart Foundation" />
        <p>
          Dedicated to the prevention, control, and treatment of heart disease in
          children in Kenya.
        </p>
      </div>
      <nav aria-label="Footer navigation">
        {footerLinks.map(([label, href]) => (
          <a href={href} key={href}>{label}</a>
        ))}
      </nav>
      <div>
        <strong>Give offline</strong>
        <span>M-Pesa Paybill 517800</span>
        <span>Equity Bank 0180 2919 43847</span>
      </div>
    </footer>
  );
}
