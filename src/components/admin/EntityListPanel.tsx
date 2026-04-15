'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EntityListPanelProps<T> {
  items: T[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  onCreateNew: () => void;
  createLabel?: string;
  renderItem: (item: T) => React.ReactNode;
  renderDetail: () => React.ReactNode;
  emptyIcon: React.ReactNode;
  emptyMessage: string;
  getItemId: (item: T) => string;
}

export function EntityListPanel<T>({
  items,
  selectedId,
  onSelect,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onCreateNew,
  createLabel = '+ Шинэ',
  renderItem,
  renderDetail,
  emptyIcon,
  emptyMessage,
  getItemId,
}: EntityListPanelProps<T>) {
  return (
    <div className="p-6 h-full flex gap-6 overflow-hidden max-w-[1600px] mx-auto w-full">
      {/* List Panel */}
      <div className="w-1/2 md:w-5/12 lg:w-4/12 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center gap-2 bg-gray-50/50">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            />
          </div>
          <Button onClick={onCreateNew} size="sm" className="h-7 text-xs px-2.5 bg-brand hover:bg-brand-hover tracking-tight flex-shrink-0">
            {createLabel}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto w-full">
          {items.map((item) => (
            <div key={getItemId(item)} onClick={() => onSelect(getItemId(item))}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-y-auto relative">
        {!selectedId ? (
          <div className="flex h-full items-center justify-center text-gray-400 flex-col gap-2">
            {emptyIcon}
            <span>{emptyMessage}</span>
          </div>
        ) : (
          renderDetail()
        )}
      </div>
    </div>
  );
}
