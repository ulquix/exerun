const Loader = ({ variable }: { variable: string }) => {
  if (variable !== undefined && variable !== null) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="h-16 w-16 border-4 border-t-transparent border-white rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
