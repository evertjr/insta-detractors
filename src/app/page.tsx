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
              href="https://instagram.com/evertju"
              target="_blank"
              rel="noopener noreferrer"
            >
              Evert Junior
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
