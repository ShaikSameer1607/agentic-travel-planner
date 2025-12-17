export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center">
      <div className="border-t-4 border-t-neonBlue animate-spin rounded-full h-12 w-12 mb-4"></div>
      <p className="text-neonBlue font-medium">AI Agent is planning your trip...</p>
    </div>
  );
}