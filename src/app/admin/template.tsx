export default function AdminTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="admin-page-motion">{children}</div>;
}
