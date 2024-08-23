'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EntriesProvider, Entry, useEntries } from './contexts/entries-context';

export default function Page() {
  const { addEntry, disableInput, entries, removeGoodbyeEntries } =
    useEntries();

  const [inputValue, setInputValue] = useState('');
  const [scrolling, setScrolling] = useState<boolean>(false);

  const entriesEndRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleFilterButtonClick = () => {
    removeGoodbyeEntries();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (inputValue.trim()) {
        addEntry(inputValue, false);
        setInputValue('');
      }
      event.preventDefault();
    }
  };

  const newEntries = () => {
    return entries.length > 0 ? (
      entries.map((entry: Entry, index: number) => {
        if (index === 0) {
          return (
            <motion.div
              key={index}
              className={`flex p-4 border-2 rounded-md text-xs ${
                entry.agent
                  ? `bg-gray-300 border-gray-300 w-fit shadow-md`
                  : `bg-blue-500 text-white border-blue-500 shadow-md w-fit justify-end self-end`
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 10 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ delay: 0.75 }}
            >
              {entry.message}
            </motion.div>
          );
        }

        return (
          <div
            key={index}
            className={`flex p-4 border-2 rounded-md text-xs ${
              entry.agent
                ? `bg-gray-300 border-gray-300 w-fit shadow-md`
                : `bg-blue-500 text-white border-blue-500 shadow-md w-fit justify-end self-end`
            }`}
          >
            {entry.message}
          </div>
        );
      })
    ) : (
      <div>No entries available</div>
    );
  };

  useEffect(() => {
    if (scrolling && entriesEndRef && entriesEndRef.current) {
      entriesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setScrolling(false);
    }
  }, [scrolling, entries]);

  useEffect(() => {
    if (entries.length > 0) {
      setScrolling(true);
    }
  }, [entries]);

  return (
    <div className='flex w-full h-full bg-white flex-row justify-center'>
      {/* <div className='flex border border-black rounded-2xl h-full basis-1/4'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 10 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ delay: 0.75 }}
          className='flex border border-black rounded-md h-24  flex-col items-center p-2'
        >
          <div className='font-normal text-center'>message count:</div>
          <div className='font-extrabold text-xl'>{entries.length}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ delay: 0.75 }}
        >
          <button
            className='border border-black rounded-md px-4 py-1'
            onClick={handleFilterButtonClick}
          >
            filter button
          </button>
        </motion.div>
      </div> */}

      <div className='flex border rounded-2xl gap-2 h-full w-60 flex-col box-border shadow-lg'>
        <div className='border-b rounded-t-2xl bg-blue-500 text-white'>
          {' '}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ delay: 0.75 }}
            className='flex text-md rounded-md h-12 flex-row justify-around p-1'
          >
            <div className='font-extrabold'>message count:</div>
            <motion.div
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 2 }}
              className='font-extrabold cursor-pointer'
            >
              {entries.length}
            </motion.div>
          </motion.div>
        </div>
        <div className='flex flex-col h-full overflow-y-auto gap-4 pl-2 pr-2'>
          {newEntries()}
          <div ref={entriesEndRef} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ delay: 0.75 }}
          className='flex border-t border-b rounded-b-md'
        >
          {' '}
          <input
            className='border h-2 border-transparent cursor-text rounded-md flex-1 text-xs p-4'
            placeholder='Type a Message...'
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyPress(e)
            }
          ></input>
          <motion.button
            whileHover={{
              scale: 1.2,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 1.2 }}
            className={`bg-gray-300 text-black rounded-2xl text-xs m-1 p-1 ${
              !inputValue ? `text-gray-100` : ``
            }`}
            onClick={() => {
              if (inputValue.trim()) {
                addEntry(inputValue, false);
                setInputValue('');
              }
            }}
            disabled={!inputValue}
          >
            enter
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.2,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 1.2 }}
            className='bg-blue-500 text-white rounded-2xl text-xs m-1 p-1'
            onClick={handleFilterButtonClick}
          >
            filter
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
