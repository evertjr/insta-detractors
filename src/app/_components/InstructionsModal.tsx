import { InfoIcon } from "lucide-react";
import Image from "next/image";
import { Drawer } from "vaul";

export function InstructionsModal() {
  return (
    <Drawer.Root>
      <InfoIcon className="w-5 text-purple-500 inline-flex" />
      <Drawer.Trigger>
        <span className="underline text-purple-700">
          Como conseguir esse arquivo?
        </span>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[90%] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-white rounded-t-[10px] overflow-y-scroll  flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-bold mb-4">
                Solicitando seus dados do Instagram
              </Drawer.Title>
              <div className="flex flex-col gap-2">
                <p>
                  Utilizamos um método 100% seguro e privativo para obter essas
                  informações, sem necessidade de usar sua senha ou arriscar ter
                  sua conta banida. Para isso é necessário que solicite seus
                  dados ao Instagram. É simples e você recebe em poucos minutos.
                </p>
                <p>
                  Acesse as configurações do app ou site e siga os passos das
                  imagens abaixo.
                </p>
                <p className="bg-zinc-100 rounded-xl px-2 py-1">
                  Obs: Para evitar falsos positivos, é importante que selecione{" "}
                  <strong>Desde o início</strong> no intervalo de datas.
                </p>
              </div>
              <ul className="mt-4">
                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                  <li key={num} className="bg-zinc-400">
                    <Image
                      src={`/img/${num}.webp`}
                      alt={`Image ${num}`}
                      width={720}
                      height={1280}
                      className="mb-4 w-full object-contain"
                    />
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Pronto! Você receberá em seu email um link para baixar um
                arquivo zip, basta anexar no lugar indicado neste site.
              </p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
