"use client";

import { motion } from "framer-motion";
import JSZip from "jszip";
import { CheckCheck, ExternalLink, InfoIcon } from "lucide-react";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { Drawer } from "vaul";

type Profile = {
  href: string;
  value: string;
  timestamp: number;
};

export function DetractorsComponent() {
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [detractors, setDetractors] = useState<Profile[]>([]);
  const [pendingFollowRequests, setPendingFollowRequests] = useState<Profile[]>(
    []
  );
  const [showPending, setShowPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);

      // Use regex to match file names
      const followersPattern = /^.*followers(?:_\d+)?\.json$/;
      const followingPattern = /^.*following(?:_\d+)?\.json$/;
      const pendingPattern = /^.*pending_follow_requests\.json$/;

      const followersProfiles: Profile[] = [];
      const followingProfiles: Profile[] = [];
      const pendingProfiles: Profile[] = [];

      const pendingFiles = Object.keys(content.files).filter((name) =>
        pendingPattern.test(name)
      );

      if (pendingFiles.length > 0) {
        const fileContent = await content.files[pendingFiles[0]].async("text");
        try {
          const json = JSON.parse(fileContent);
          pendingProfiles.push(
            ...json.relationships_follow_requests_sent.flatMap(
              (entry: any) => entry.string_list_data
            )
          );
        } catch (error) {
          console.error(
            "Error parsing JSON for pending follow requests.",
            error
          );
        }
      }

      // Search and process followers
      await Promise.all(
        Object.keys(content.files)
          .filter((name) => followersPattern.test(name))
          .map(async (name) => {
            const fileContent = await content.files[name].async("text");
            try {
              const json = JSON.parse(fileContent);
              followersProfiles.push(
                ...json.map((entry: any) => entry.string_list_data[0])
              );
            } catch (error) {
              console.error(
                `Error parsing JSON in followers' data for file: ${name}`,
                error
              );
            }
          })
      );

      // Search and process following
      await Promise.all(
        Object.keys(content.files)
          .filter((name) => followingPattern.test(name))
          .map(async (name) => {
            const fileContent = await content.files[name].async("text");
            try {
              const json = JSON.parse(fileContent);
              followingProfiles.push(
                ...json.relationships_following.map(
                  (entry: any) => entry.string_list_data[0]
                )
              );
            } catch (error) {
              console.error(
                `Error parsing JSON in following data for file: ${name}`,
                error
              );
            }
          })
      );

      setPendingFollowRequests(pendingProfiles);
      setFollowers(followersProfiles);
      setFollowing(followingProfiles);
    }
  };

  const calculateDetractors = (e: FormEvent) => {
    e.preventDefault();
    const followersSet = new Set(followers.map((f) => f.value));
    const detractorsList = following.filter((f) => !followersSet.has(f.value));

    if (detractorsList.length === 0) {
      return setError(
        "Nada encontrado, isso provavelmente foi um erro ao ler o arquivo."
      );
    }

    setError(null);

    setDetractors(detractorsList);
    setShowPending(true);
  };

  return (
    <form id="followers-form" className="p-4 w-full max-w-4xl mx-auto mt-8">
      <span className="text-3xl mr-2">🤔</span>

      <h1 className="bg-gradient-to-r font-bold text-3xl from-purple-600 via-pink-500 to-red-400 inline-block text-transparent bg-clip-text">
        Há falsas em trenós...
      </h1>
      <h2 className="text-zinc-500 mt-2">
        Descubra quem saiu sem fechar a porta. Simples e seguro.
      </h2>
      <div className="my-6 flex gap-4 flex-wrap">
        <div className="flex flex-col gap-2 bg-zinc-100 w-full md:w-fit p-4 rounded-xl">
          <label htmlFor="followers-file" className="font-bold">
            Anexe o arquivo .zip aqui:
          </label>
          <input
            name="followers-file"
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            placeholder="Upload ZIP File"
          />
          <div className="bg-zinc-200 rounded-xl p-2 flex items-center gap-2 mt-4">
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
                          Utilizamos um método 100% seguro e privativo para
                          obter essas informações, sem necessidade de usar sua
                          senha ou arriscar ter sua conta banida. Para isso é
                          necessário que solicite seus dados ao Instagram. É
                          simples e você recebe em poucos minutos.
                        </p>
                        <p>
                          Acesse as configurações do app ou site e siga os
                          passos das imagens abaixo.
                        </p>
                        <p className="bg-zinc-100 rounded-xl px-2 py-1">
                          Obs: Para evitar falsos positivos, é importante que
                          selecione <strong>Desde o início</strong> no intervalo
                          de dados.
                        </p>
                      </div>
                      <ul className="mt-4">
                        {Array.from({ length: 8 }, (_, i) => i + 1).map(
                          (num) => (
                            <li key={num} className="bg-zinc-400">
                              <Image
                                src={`/img/${num}.webp`}
                                alt={`Image ${num}`}
                                width={720}
                                height={1280}
                                className="mb-4 w-full object-contain"
                              />
                            </li>
                          )
                        )}
                      </ul>
                      <p className="mt-4">
                        Pronto! Você receberá em seu email um link para baixar
                        um arquivo, basta anexar no lugar indicado neste site.
                      </p>
                    </div>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          </div>
          <small className="text-zinc-600 text-xs">
            Tudo será processado no seu dispositivo e nenhum dado será enviado
            para a internet.
          </small>
        </div>
      </div>
      <motion.button
        whileTap={{
          scale: 0.9,
        }}
        type="submit"
        className="px-6 py-2 font-medium bg-purple-600 border text-white border-purple-600 rounded-full hover:bg-purple-800"
        onClick={calculateDetractors}
      >
        Buscar Falsianes
      </motion.button>

      <div className="pt-8 mt-8 border-t border-dashed max-w-6xl scroll-mt-10">
        {error && <span className="text-zinc-500">{error}</span>}
        {pendingFollowRequests.length > 0 && showPending && (
          <motion.section
            animate={{
              y: [100, 0],
            }}
            className="max-w-6xl"
          >
            <h2 className="font-bold">
              Não aceitou sua solicitação de seguir:
            </h2>
            <h3 className="text-sm text-zinc-400">
              Talvez se mandar uma carta ou um pombo correio...
            </h3>
            <ul className="flex mt-4 flex-wrap gap-4">
              {pendingFollowRequests.map((request, index) => (
                <PendingFollowersLink
                  key={index}
                  href={request.href}
                  value={request.value}
                />
              ))}
            </ul>
          </motion.section>
        )}
        {detractors.length > 0 && (
          <motion.section
            animate={{
              y: [100, 0],
            }}
            className="mt-10"
          >
            <h2 className="font-bold">Não te segue de volta:</h2>
            <h3 className="text-sm text-zinc-400">
              Ta achando que é celebridade.
            </h3>

            <ul className="flex gap-4 mt-4 flex-wrap">
              {detractors.map((d, index) => (
                <DetractorLink key={index} href={d.href} value={d.value} />
              ))}
            </ul>
          </motion.section>
        )}
      </div>
    </form>
  );
}

function DetractorLink({ href, value }: { href: string; value: string }) {
  const [opened, setOpened] = useState(false);

  return (
    <li>
      <motion.a
        whileHover={{
          rotate: -3,
          scale: 1.2,
        }}
        data-opened={opened ? "true" : "false"}
        onClick={(e) => {
          setOpened(true);
        }}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-purple-800 data-[opened=true]:text-lime-800 data-[opened=true]:bg-lime-200 flex gap-2 items-center justify-center break-all  hover:bg-purple-50  border-purple-300 data-[opened=true]:border-lime-300 border bg-purple-100 px-2 py-2 rounded-xl"
      >
        {value}
        <ExternalLink className="w-4" />
        {opened && <CheckCheck className="w-5 text-lime-500" />}
      </motion.a>
    </li>
  );
}

function PendingFollowersLink({
  href,
  value,
}: {
  href: string;
  value: string;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <li>
      <motion.a
        whileHover={{
          rotate: -3,
          scale: 1.2,
        }}
        data-opened={opened ? "true" : "false"}
        onClick={(e) => {
          setOpened(true);
        }}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-indigo-800 data-[opened=true]:text-lime-800 data-[opened=true]:bg-lime-200 flex gap-2 items-center justify-center break-all  hover:bg-indigo-50  border-indigo-300 data-[opened=true]:border-lime-300 border bg-indigo-100 px-2 py-2 rounded-xl"
      >
        {value}
        <ExternalLink className="w-4" />
        {opened && <CheckCheck className="w-5 text-lime-500" />}
      </motion.a>
    </li>
  );
}
