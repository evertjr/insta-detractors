"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { motion } from "framer-motion";
import JSZip from "jszip";
import { AtSign } from "lucide-react";
import React, { FormEvent, useCallback, useState, useTransition } from "react";
import { InstructionsModal } from "./InstructionsModal";
import { Spinner } from "./Spinner";
import { UserLink } from "./UserLink";

type Profile = {
  href: string;
  value: string;
  timestamp: number;
};

export function DetractorsComponent() {
  const [isPending, startTransition] = useTransition();

  const [followers, setFollowers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [detractors, setDetractors] = useState<Profile[]>([]);
  const [pendingFollowRequests, setPendingFollowRequests] = useState<Profile[]>(
    []
  );

  const [showPending, setShowPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchTermRef = React.useRef<HTMLInputElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const filterDetractors = detractors.filter((d) =>
    d.value && d.value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );
  const filterPendingFollowRequests = pendingFollowRequests.filter((request) =>
    request.value && request.value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      startTransition(async () => {
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
            const fileContent = await content.files[pendingFiles[0]].async(
              "text"
            );
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
      });
    },
    []
  );

  const calculateDetractors = (e: FormEvent) => {
    e.preventDefault();
    sessionStorage.clear();
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
            {isPending && (
              <Spinner className="inline-flex self-center mx-2 w-5" />
            )}
          </label>
          <input
            name="followers-file"
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            placeholder="Upload ZIP File"
          />
          <div className="bg-zinc-200 rounded-xl p-2 flex items-center gap-2 mt-4">
            <InstructionsModal />
          </div>
          <small className="text-zinc-600 text-xs">
            Tudo será processado no seu dispositivo e nenhum dado será enviado
            para a internet.
          </small>
        </div>
      </div>
      <motion.button
        disabled={isPending}
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

        {pendingFollowRequests.length > 0 && detractors.length > 0 && (
          <div className="relative flex items-center mb-6">
            <AtSign className="w-4 h-4 absolute left-3 text-zinc-400" />
            <input
              ref={searchTermRef}
              id="search"
              type="text"
              onChange={(e) =>
                startTransition(() => setSearchTerm(e.target.value))
              }
              placeholder="Filtrar falsianes..."
              className="pr-4 pl-10 py-2 border rounded-full"
            />
          </div>
        )}

        {filterPendingFollowRequests.length > 0 && showPending && (
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
              {filterPendingFollowRequests.map((request, index) => (
                <li key={index}>
                  <UserLink
                    variant="pendingFollowers"
                    href={request.href}
                    value={request.value}
                  />
                </li>
              ))}
            </ul>
          </motion.section>
        )}
        {filterDetractors.length > 0 && (
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
              {filterDetractors.map((d, index) => (
                <li key={index}>
                  <UserLink variant="detractor" href={d.href} value={d.value} />
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </div>
    </form>
  );
}
