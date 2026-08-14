'use client';

import { useEffect } from "react";
import { useLogger } from "@/lib/logger-context";

export default function Home() {
  const logger = useLogger();

  logger.info('Rendering home page...', {
    platform: navigator.userAgent,
  });
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-zinc-50 dark:bg-gray-900">
      <h1> We are cooking up something awesome... </h1>
      <hr className="w-96 h-1 mx-auto my-4 border-0 rounded-sm md:my-10 bg-gray-900 dark:bg-amber-50" />
      <p> Pardon the lack of detail, we will reach out when we have more info for you!</p>
    </div>
  );
}
