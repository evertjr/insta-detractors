"use client";

import JSZip from "jszip";
import { useCallback, useState } from "react";
import { Spinner } from "../_components/Spinner";
import { UserLink } from "../_components/UserLink";

type Profile = {
  href: string;
  value: string;
  timestamp: number;
};

export default function FollowList() {
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      setError(null);
      try {
        const file = e.target.files?.[0];
        if (file) {
          const zip = new JSZip();
          const content = await zip.loadAsync(file);

          const followersPattern = /^.*followers(?:_\d+)?\.json$/;
          const followingPattern = /^.*following(?:_\d+)?\.json$/;

          const followersProfiles: Profile[] = [];
          const followingProfiles: Profile[] = [];

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

          setFollowers(followersProfiles);
          setFollowing(followingProfiles);
        }
      } catch (error) {
        setError("Error processing the file. Please try again.");
        console.error("Error processing the file", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <div className="p-4 w-full max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Following and Followers List</h1>
      <div className="my-6 flex gap-4 flex-wrap">
        <div className="flex flex-col gap-2 bg-zinc-100 w-full md:w-fit p-4 rounded-xl">
          <label htmlFor="followers-file" className="font-bold">
            Attach the .zip file here:
            {loading && (
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
          <small className="text-zinc-600 text-xs">
            All processing is done on your device and no data is sent to the
            internet.
          </small>
        </div>
      </div>
      {error && <span className="text-red-500">{error}</span>}
      <section>
        <h2 className="text-2xl font-semibold">Following</h2>
        <ul className="flex gap-4 mt-4 flex-wrap">
          {following.map((follow, index) => (
            <li key={index}>
              <UserLink
                variant="pendingFollowers"
                href={follow.href}
                value={follow.value}
              />
            </li>
          ))}
        </ul>
      </section>
      {/* <section className="mb-8">
        <h2 className="text-2xl font-semibold">Followers</h2>
        <ul className="flex gap-4 mt-4 flex-wrap">
          {followers.map((follower, index) => (
            <li key={index}>
              <UserLink
                variant="detractor"
                href={follower.href}
                value={follower.value}
              />
            </li>
          ))}
        </ul>
      </section> */}
    </div>
  );
}
