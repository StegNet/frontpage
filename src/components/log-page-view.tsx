'use client';

import { useEffect } from 'react';
import { useLogger } from '@/lib/logger-context';

// Logs once when a page mounts, so server-rendered pages can still log.
export function LogPageView({ message }: { message: string }) {
  const logger = useLogger();
  useEffect(() => {
    logger.info(message, { platform: navigator.userAgent });
  }, [logger, message]);
  return null;
}
