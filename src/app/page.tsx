import PolicyGeneratorForm from "@/components/PolicyGeneratorForm";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl" style={{ fontFamily: "'Lora', serif" }}>
          Policy Generator for Developers
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600" style={{ fontFamily: "'Lora', serif" }}>
          Answer a few simple questions to generate essential legal policies for your business.
        </p>
      </div>

      <div className="mt-12">
        <PolicyGeneratorForm />
      </div>
    </main>
  );
}
