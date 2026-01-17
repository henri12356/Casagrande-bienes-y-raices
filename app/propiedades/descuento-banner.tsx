import Image from "next/image";

export default function DescuentoBanner({
  titulo,
  imagen,
}: {
  titulo: string;
  imagen: string;
}) {
  return (
    <section className="pt-10">
      <h2 className="text-3xl font-extrabold text-[#0B6FB6]">
        ¡Grandes descuentos solo por pocos días!
      </h2>

      <div className="mt-6 overflow-hidden rounded-3xl bg-[#F3F7FB] p-6">
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl">
          <Image
            src={imagen}
            alt={titulo}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
