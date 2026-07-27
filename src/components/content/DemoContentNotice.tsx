type DemoContentNoticeProps = {
  children?: React.ReactNode;
};

export function DemoContentNotice({ children }: DemoContentNoticeProps) {
  return (
    <aside className="demo-content-notice" role="note" aria-label="Демонстрационный контент">
      <strong>Демонстрационный контент.</strong>{" "}
      {children ?? "Тексты и реквизиты приведены только для наполнения макета и не являются публичной офертой, гарантией или юридически значимым документом."}
    </aside>
  );
}
