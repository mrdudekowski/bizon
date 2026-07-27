export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-brand-context="shop">
      {children}
    </div>
  );
}
