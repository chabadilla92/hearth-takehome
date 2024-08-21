'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export interface Entry {
  message: string;
  agent: boolean;
}

interface EntriesContextType {
  disableInput: boolean;
  entries: Entry[];
  addEntry: (message: string, agent: boolean) => void;
  removeGoodbyeEntries: () => void;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export const EntriesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<Entry[]>([
    { message: 'Hello', agent: true },
  ]);
  const [disableInput, setDisableInput] = useState<boolean>(false);
  const [currentResponseIndex, setCurrentResponseIndex] = useState<number>(0);
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const [currentTypingMessage, setCurrentTypingMessage] = useState<
    string | null
  >(null);

  const typewriterEffect = (message: string) => {
    setCurrentTypingMessage(message);
    setTypingIndex(0);
  };

  useEffect(() => {
    if (currentTypingMessage && typingIndex < currentTypingMessage.length) {
      const timer = setInterval(() => {
        setEntries((prevEntries) => {
          const newEntries = [...prevEntries];
          newEntries[newEntries.length - 1] = {
            message: currentTypingMessage.substring(0, typingIndex + 1),
            agent: true,
          };
          return newEntries;
        });
        setTypingIndex((prevIndex) => prevIndex + 1);
      }, 20);

      return () => clearInterval(timer);
    }
  }, [currentTypingMessage, typingIndex]);

  const agentResponses = ['Hello again', 'Goodbye', 'Hello'];

  const addEntry = (message: string, agent: boolean) => {
    setEntries((prevEntries) => [...prevEntries, { message, agent }]);
    setDisableInput(true);

    setTimeout(() => {
      const agentMessage = agentResponses[currentResponseIndex];

      typewriterEffect(agentMessage);

      setEntries((prevEntries) => [
        ...prevEntries,
        {
          message: '',
          agent: true,
        },
      ]);

      setCurrentResponseIndex(
        (prevIndex) => (prevIndex + 1) % agentResponses.length
      );
      setDisableInput(false);
    }, 750);
  };

  const removeGoodbyeEntries = () => {
    setEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.message !== 'Goodbye')
    );
  };

  return (
    <EntriesContext.Provider
      value={{ disableInput, entries, addEntry, removeGoodbyeEntries }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

export const useEntries = (): EntriesContextType => {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
};
