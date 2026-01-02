import DemoSection from "@/components/home/demo-section";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function TodoPage() {
  return (
    <div className="flex flex-col gap-16 pb-10">
      <Navbar />
      <DemoSection />
      <Footer />
    </div>
  );
}
