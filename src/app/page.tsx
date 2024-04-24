import DetractorsComponent from "./_components/InstaDetractors";

export default function Home() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <main className="border-t-8 border-t-purple-600">
        <DetractorsComponent />
      </main>
      <footer className="p-6">
        <p className="text-center text-gray-600">
          Made with ❤️ by Evert Junior
        </p>
      </footer>
    </div>
  );
}
