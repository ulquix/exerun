import { cn } from "@/lib/utils";
const Logo = ({ className }: { className?: string }) => {
  return (
    <h1
      className={cn(
        "text-6xl font-extrabold max-lg:left-[50%] max-lg:translate-x-[-50%] font-notdisplay bg-linear-to-b  to-slate-900 via-slate-600 from-slate-900  bg-clip-text text-transparent text-shadow-2xl",
        className,
      )}
    >
      exerun
    </h1>
  );
};

export default Logo;
