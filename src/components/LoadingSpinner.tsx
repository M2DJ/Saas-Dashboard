const LoadingSpinner = ({ size = "md", color = "5B92FF" }: { size?: "sm" | "md" | "lg", color?: string }) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4"
  };

  return (
    <div className={`${sizeClasses[size]} border-[#${color}] border-t-transparent rounded-full animate-spin`}></div>
  );
};

export default LoadingSpinner;
