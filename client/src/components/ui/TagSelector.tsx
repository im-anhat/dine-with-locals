import React, { useState, useRef, useEffect } from 'react';

interface TagSelectorProps {
  label: string;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  predefinedOptions: string[];
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  label,
  selectedTags,
  onTagsChange,
  predefinedOptions,
  placeholder = 'Type to search...',
  maxTags,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customInput, setCustomInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = predefinedOptions.filter(
    (option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTags.includes(option),
  );

  const handleAddTag = (tag: string) => {
    if (
      !selectedTags.includes(tag) &&
      (!maxTags || selectedTags.length < maxTags)
    ) {
      onTagsChange([...selectedTags, tag]);
    }
    setSearchTerm('');
    setCustomInput('');
    setIsOpen(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddCustom = () => {
    const trimmedInput = customInput.trim();
    if (
      trimmedInput &&
      !selectedTags.includes(trimmedInput) &&
      (!maxTags || selectedTags.length < maxTags)
    ) {
      onTagsChange([...selectedTags, trimmedInput]);
      setCustomInput('');
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        handleAddTag(filteredOptions[0]);
      } else if (customInput.trim()) {
        handleAddCustom();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
      setCustomInput('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setCustomInput('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCustomInput(searchTerm);
  }, [searchTerm]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-brand-stone-700">
        {label}
        {maxTags && (
          <span className="text-xs text-gray-500 ml-1">
            ({selectedTags.length}/{maxTags})
          </span>
        )}
      </label>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 min-h-[32px] p-2 border border-gray-300 rounded-md bg-gray-50">
        {selectedTags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-coral-100 text-brand-coral-700 border border-brand-coral-200"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-brand-coral-500 hover:text-brand-coral-700 focus:outline-none"
              >
                ×
              </button>
            )}
          </span>
        ))}
        {selectedTags.length === 0 && (
          <span className="text-gray-400 text-sm">
            No {label.toLowerCase()} selected
          </span>
        )}
      </div>

      {/* Add New Tags */}
      {!disabled && (!maxTags || selectedTags.length < maxTags) && (
        <div className="relative" ref={dropdownRef}>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
            placeholder={placeholder}
          />

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 && (
                <div className="py-1">
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                    Suggestions
                  </div>
                  {filteredOptions.slice(0, 8).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAddTag(option)}
                      className="w-full text-left px-3 py-2 hover:bg-brand-coral-50 hover:text-brand-coral-700 focus:outline-none focus:bg-brand-coral-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {customInput.trim() &&
                !predefinedOptions.includes(customInput.trim()) && (
                  <div className="py-1 border-t border-gray-200">
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                      Add Custom
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustom}
                      className="w-full text-left px-3 py-2 hover:bg-brand-teal-50 hover:text-brand-teal-700 focus:outline-none focus:bg-brand-teal-50"
                    >
                      Add "{customInput.trim()}"
                    </button>
                  </div>
                )}

              {filteredOptions.length === 0 && !customInput.trim() && (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  No options found
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
