const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-50 dark:bg-secondary-900">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-secondary-700" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary-500" />
      </div>
    </div>
  );
};

export default Loading;
