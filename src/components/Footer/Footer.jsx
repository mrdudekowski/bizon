/**
 * Футер сайта
 */
export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <span>BIZON Tires</span>
        <span>Premium heavy-duty solutions</span>
        <span>info@bizontires.example</span>
        <span>© {year}</span>
      </div>
    </footer>
  );
};
