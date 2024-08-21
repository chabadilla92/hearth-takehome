'use client';

import { useEffect, useRef, useState } from 'react';
import { Entry, useEntries } from './contexts/entries-context';

export default function Home() {
  const { disableInput, entries, addEntry, removeGoodbyeEntries } =
    useEntries();

  const [inputValue, setInputValue] = useState('');
  const [scrolling, setScrolling] = useState<boolean>(false);

  const entriesEndRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    if (inputValue.trim()) {
      addEntry(inputValue, false);
      setInputValue('');
    }
  };

  const handleFilterButtonClick = () => {
    removeGoodbyeEntries();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
      entries.map((entry: Entry, index: number) => (
        <div
          key={index}
          className={`flex p-4 border-2 rounded-md text-xs ${
            entry.agent
              ? `border-yellow-600 w-fit`
              : `border-blue-600 w-fit justify-end self-end`
          }`}
        >
          {entry.message}
        </div>
      ))
    ) : (
      <div>No entries available</div>
    );
  };

  useEffect(() => {
    if (scrolling && entriesEndRef.current) {
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
    <div className='flex w-full h-full bg-white flex-row justify-between'>
      <div className='flex border border-black rounded-2xl h-full basis-1/4'>
        <div className='flex border border-black rounded-md h-16 basis-3/4 mx-auto my-4 flex-col items-center p-2'>
          <div>message count:</div>
          <div>{entries.length}</div>
        </div>
      </div>
      <div className='h-full basis-1/2'>
        <div className='flex h-full flex-col justify-center items-center basis-1/2'>
          <button
            className='border border-black rounded-md px-4 py-1'
            onClick={handleFilterButtonClick}
          >
            filter button
          </button>
        </div>
      </div>
      <div className='flex border border-black rounded-2xl gap-2 h-full basis-1/4 flex-col p-2 box-border max-w-xs'>
        <div className='flex flex-col basis-5/6 overflow-y-auto gap-2'>
          {newEntries()}
          <div ref={entriesEndRef} />
        </div>
        <div className='flex border border-black rounded-md basis-1/6'>
          <textarea
            className={`border border-transparent rounded-md flex-1 text-xs p-4 ${
              disableInput ? `bg-gray` : ``
            }`}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          ></textarea>
          {/* TODO: bring back later?? */}
          {/* <button onClick={handleButtonClick}>ENTER</button> */}
        </div>
      </div>
    </div>
  );
}
