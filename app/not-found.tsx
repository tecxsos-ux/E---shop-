
import Link from 'next/link';
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-4xl font-bold mb-4">Not Found</h2>
      <p className="mb-6 text-gray-600">Could not find requested resource</p>
      <Link href="/" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Return Home</Link>
    </div>
  );
}
