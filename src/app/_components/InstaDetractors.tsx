"use client";

import React, { useState } from "react";

type Profile = {
  href: string;
  value: string;
  timestamp: number;
};

const DetractorsComponent: React.FC = () => {
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [detractors, setDetractors] = useState<Profile[]>([]);

  const handleFileChange =
    (isFollowers: boolean) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const text = await file.text();
        const json = JSON.parse(text);
        // Determine if the provided file is the followers file, or else it's assumed to be following
        const profiles = isFollowers
          ? json.map((entry: any) => entry.string_list_data[0])
          : json.relationships_following.map(
              (entry: any) => entry.string_list_data[0]
            );

        if (isFollowers) {
          setFollowers(profiles);
        } else {
          setFollowing(profiles);
        }
      }
    };

  const calculateDetractors = () => {
    const followersSet = new Set(followers.map((f) => f.value));
    const detractorsList = following.filter((f) => !followersSet.has(f.value));
    setDetractors(detractorsList);
  };

  return (
    <div className="p-4">
      <div className="my-6 flex gap-4 flex-wrap">
        <div className="flex flex-col gap-2 bg-zinc-100 w-fit p-4 rounded-xl">
          <label htmlFor="followers-file" className="font-bold">
            Followers
          </label>
          <input
            name="followers-file"
            type="file"
            accept=".json"
            onChange={handleFileChange(true)}
            placeholder="Upload Followers JSON"
          />
        </div>
        <div className="flex flex-col gap-2 bg-zinc-100 w-fit p-4 rounded-xl">
          <label htmlFor="following-file" className="font-bold">
            Following
          </label>
          <input
            name="following-file"
            type="file"
            accept=".json"
            onChange={handleFileChange(false)}
            placeholder="Upload Following JSON"
          />
        </div>
      </div>
      <button
        className="px-6 py-2 font-medium bg-zinc-100 border border-zinc-300 rounded-full hover:bg-zinc-200"
        onClick={calculateDetractors}
      >
        Buscar Falsianes
      </button>
      <div className="mt-10 max-w-6xl">
        <ul className="grid grid-cols-4 gap-4">
          {detractors.map((d, index) => (
            <li key={index}>
              <a
                href={d.href}
                target="_blank"
                rel="noreferrer"
                className="text-sky-800 flex items-center justify-center break-all hover:-rotate-2 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-800 transition-transform border-sky-300 border bg-sky-50 px-4 py-4 rounded-xl hover:scale-110"
              >
                {d.value}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetractorsComponent;
