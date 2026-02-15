"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
    id: string;
    label: string;
}

interface DropdownProps {
    options: Option[];
    selectedId: string;
    onSelect: (id: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
}

export function Dropdown({
    options,
    selectedId,
    onSelect,
    placeholder = "Select option",
    label,
    className = ""
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.id === selectedId);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && <h3 className="font-bold text-gray-900 dark:text-white mb-4">{label}</h3>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none flex items-center justify-between transition-all hover:border-red-500/50"
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-60 overflow-y-auto scrollbar-hide">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${selectedId === option.id ? "bg-red-50 dark:bg-red-900/10 text-red-600 font-bold" : "hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"}`}
                                onClick={() => {
                                    onSelect(option.id);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="truncate">{option.label}</span>
                                {selectedId === option.id && <Check className="w-4 h-4 text-red-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
