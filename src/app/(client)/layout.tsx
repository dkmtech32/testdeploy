import Footer from "@/components/footer";
import Header from "@/components/header";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex-grow overflow-y-auto lg:p-2 bg-gray-100 dark:bg-gray-900 relative">
        {children}
      </div>
      <Footer />
    </>
  );
}
