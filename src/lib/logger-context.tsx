'use client';

import { createContext, useContext, useMemo } from 'react';
import { getLogger, type Logger } from '@logtape/logtape';

const ROOT_CATEGORY = ['frontpage', 'app'];

interface LoggerContextValue {
  logger: Logger;
}

const LoggerContext = createContext<LoggerContextValue | null>(null);

export function LoggerProvider({ children }: { children: React.ReactNode }) {
  const logger = useMemo(() => getLogger(ROOT_CATEGORY), []);
  const value = useMemo(() => ({ logger }), [logger]);

  return (
    <LoggerContext.Provider value={value}>{children}</LoggerContext.Provider>
  );
}

export function useLogger(): Logger {
  const context = useContext(LoggerContext);
  if (!context) return getLogger(ROOT_CATEGORY);
  return context.logger;
}

export function useChildLogger(category: string): Logger {
  const parentLogger = useLogger();
  return useMemo(
    () => parentLogger.getChild(category),
    [parentLogger, category],
  );
}
