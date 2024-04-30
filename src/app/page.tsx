import { DetractorsComponent } from "./_components/InstaDetractors";

export default function Home() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <main className="border-t-8 border-t-purple-600">
        <DetractorsComponent />
      </main>
      <footer className="p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Made with ❤️ by{" "}
            <a
              href="https://instagram.com/ooevert"
              target="_blank"
              rel="noopener noreferrer"
            >
              Evert Junior
            </a>
          </p>
          <a
            href="https://alertpix.live/evertjunior"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-1 text-xs hover:bg-purple-600/10 rounded-full border text-purple-800 border-purple-400 transition-colors"
          >
            Buy me a coffee ☕
          </a>
        </div>
      </footer>
    </div>
  );
}
