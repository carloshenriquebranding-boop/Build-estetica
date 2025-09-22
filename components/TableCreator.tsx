
import * as React from 'react';

interface TableCreatorProps {
  onSelect: (rows: number, cols: number) => void;
  close?: () => void;
}

const TableCreator: React.FC<TableCreatorProps> = ({ onSelect, close }) => {
  const [grid, setGrid] = React.useState({ rows: 1, cols: 1 });

  const handleMouseOver = (rowIndex: number, colIndex: number) => {
    setGrid({ rows: rowIndex + 1, cols: colIndex + 1 });
  };

  const handleSelect = () => {
    onSelect(grid.rows, grid.cols);
    close?.();
  };

  return (
    <div className="p-2" onMouseLeave={() => setGrid({rows: 1, cols: 1})}>
      <p className="text-center text-sm mb-2">{grid.rows} x {grid.cols}</p>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 100 }).map((_, index) => {
          const rowIndex = Math.floor(index / 10);
          const colIndex = index % 10;
          const isActive = rowIndex < grid.rows && colIndex < grid.cols;
          return (
            <div
              key={index}
              onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
              onMouseDown={handleSelect}
              className={`w-4 h-4 border border-gray-300 dark:border-slate-500 transition-colors cursor-pointer ${isActive ? 'bg-pink-300 dark:bg-pink-500' : 'bg-gray-100 dark:bg-slate-600'}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TableCreator;