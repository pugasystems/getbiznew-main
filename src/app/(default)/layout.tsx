import Footer from '@/components/shared/footer';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="mx-auto max-w-largest px-14 pt-14">{children}</main>
      <Footer />
    </>
  );
}
