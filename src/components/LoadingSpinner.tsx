import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner = ({ size = "md" }: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className={`${sizeMap[size]} animate-spin`}>
      <div className="border-2 border-current border-t-transparent rounded-full w-full h-full" />
    </div>
  );
};

export default LoadingSpinner;
