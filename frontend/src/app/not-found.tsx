import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <h2 className="text-2xl font-bold text-white">Resource Not Found</h2>
      <p className="text-xs text-slate-400">The requested Kubernetes page or resource does not exist.</p>
      <Link href="/" className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold">
        Return to Dashboard
      </Link>
    </div>
  );
}
