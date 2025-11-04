import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/constants";
import { ArrowUpRight, Eye } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full justify-center">
      <div className="flex flex-col items-center max-w-[90%] gap-4">
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <h1 className="text-5xl font-normal text-center">
            Welcome to VisionAI
          </h1>
          <Eye className="size-12" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Your DL-powered online model to predict human emotions.
        </p>
        <Separator className="w-full" />
        <Link
          href={ROUTES.emotionDetection}
          className="flex items-center justify-center gap-1 mt-8 underline hover:text-accent-foreground transition"
        >
          Get Started
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
