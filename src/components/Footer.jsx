export default function Footer() {
  return (
    <footer className="w-screen bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-4 text-center">
      <p className="text-sm font-semibold">
        &copy; {new Date().getFullYear()} Galaxy Study Zone | Developed by{" "}
        <span className="font-bold">Md Dilkash</span>
      </p>
    </footer>
  );
}
