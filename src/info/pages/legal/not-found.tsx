

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 p-6 bg-white rounded-lg shadow" style={{ border: '1px solid #e5e7eb' }}>
        <div className="flex mb-4 gap-2 items-center" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '32px' }}>⚠️</span>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>404 Page Not Found</h1>
        </div>

        <p className="mt-4 text-sm text-gray-600" style={{ marginTop: '16px', fontSize: '14px', color: '#4b5563' }}>
          Did you forget to add the page to the router?
        </p>
      </div>
    </div>
  );
}
