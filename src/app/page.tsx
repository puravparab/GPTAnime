export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: 'url("/assets/images/background.png")' }}>
      <div className="text-center text-white p-8 relative z-10">
        <h1 className="text-7xl font-extrabold mb-8 tracking-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
          GPT Anime
        </h1>
        <p className="text-3xl font-light tracking-wide drop-shadow-lg max-w-3xl mx-auto leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
          Your photos reimagined in your favorite anime
        </p>
      </div>
    </div>
  );
}
