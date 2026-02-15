"use client";

import { useState, useRef, useEffect } from "react";
import {
    GripVertical, Trash2, Plus, Copy, Bold, Italic, Link as LinkIcon, List,
    Type, MapPin, Utensils, X, Search, ChevronDown
} from "lucide-react";

interface ContentBlock {
    blockType: "h2" | "h3" | "h4" | "paragraph" | "location" | "restaurant";
    content: string;
    locationId?: string;
    restaurantId?: string;
}

interface BlogContentEditorProps {
    contentBlocks: ContentBlock[];
    setContentBlocks: (blocks: ContentBlock[]) => void;
    locations: any[];
    restaurants: any[];
}

export function BlogContentEditor({ contentBlocks, setContentBlocks, locations, restaurants }: BlogContentEditorProps) {
    const [insertIndex, setInsertIndex] = useState<number | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const addBlock = (type: ContentBlock["blockType"], index?: number) => {
        const newBlock: ContentBlock = { blockType: type, content: "" };
        if (type === "location" || type === "restaurant") {
            newBlock.content = `[${type.toUpperCase()} WIDGET]`;
        }

        if (index !== undefined) {
            const updated = [...contentBlocks];
            updated.splice(index, 0, newBlock);
            setContentBlocks(updated);
        } else {
            setContentBlocks([...contentBlocks, newBlock]);
        }
        setInsertIndex(null);
    };

    const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
        const updated = [...contentBlocks];
        updated[index] = { ...updated[index], ...updates };
        setContentBlocks(updated);
    };

    const removeBlock = (index: number) => {
        setContentBlocks(contentBlocks.filter((_, i) => i !== index));
    };

    const duplicateBlock = (index: number) => {
        const updated = [...contentBlocks];
        const blockToDuplicate = { ...updated[index] };
        updated.splice(index + 1, 0, blockToDuplicate);
        setContentBlocks(updated);
    };

    const onDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const updated = [...contentBlocks];
        const itemToMove = updated.splice(draggedIndex, 1)[0];
        updated.splice(index, 0, itemToMove);
        setDraggedIndex(index);
        setContentBlocks(updated);
    };

    const onDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Post Content</h2>
            </div>

            <div className="relative">
                {contentBlocks.map((block, index) => (
                    <div key={index}>
                        {/* Insertion Point Above */}
                        <div className="group relative h-4 flex items-center justify-center">
                            <div className="absolute inset-x-0 h-[1px] bg-red-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <button
                                type="button"
                                onClick={() => setInsertIndex(index)}
                                className="relative z-10 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-lg"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        <div className={`group relative flex gap-4 items-start bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 transition-all hover:border-red-200 shadow-sm hover:shadow-md ${draggedIndex === index ? 'opacity-50 border-red-500 scale-[0.98]' : ''}`}>
                            <div
                                draggable
                                onDragStart={(e) => onDragStart(e, index)}
                                onDragOver={(e) => onDragOver(e, index)}
                                onDragEnd={onDragEnd}
                                className="flex flex-col gap-2 pt-2 cursor-grab active:cursor-grabbing hover:bg-gray-50 dark:hover:bg-zinc-800 p-1 rounded-lg"
                            >
                                <GripVertical className="h-5 w-5 text-gray-300 mx-auto group-hover:text-red-400 transition-colors" />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${block.blockType.startsWith('h') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' :
                                            block.blockType === 'paragraph' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'
                                            }`}>
                                            {block.blockType}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => duplicateBlock(index)}
                                            title="Duplicate Block"
                                            className="text-gray-300 hover:text-blue-500 transition-colors p-1"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeBlock(index)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {(block.blockType === "paragraph" || block.blockType.startsWith("h")) ? (
                                    <div className="space-y-2">
                                        {block.blockType === "paragraph" && (
                                            <div className="flex items-center gap-1 opacity-100 transition-opacity bg-gray-50 dark:bg-zinc-800 p-1 rounded-lg w-fit border border-gray-100 dark:border-zinc-700">
                                                <FormattingButton
                                                    icon={<Bold className="h-3 w-3" />}
                                                    onClick={() => document.execCommand('bold', false)}
                                                    label="Bold"
                                                />
                                                <FormattingButton
                                                    icon={<Italic className="h-3 w-3" />}
                                                    onClick={() => document.execCommand('italic', false)}
                                                    label="Italic"
                                                />
                                                {/* <FormattingButton
                                                    icon={<LinkIcon className="h-3 w-3" />}
                                                    onClick={() => {
                                                        const url = prompt("Enter URL:");
                                                        if (url) document.execCommand('createLink', false, url);
                                                    }}
                                                    label="Link"
                                                /> */}
                                                <FormattingButton
                                                    icon={<List className="h-3 w-3" />}
                                                    onClick={() => document.execCommand('insertUnorderedList', false)}
                                                    label="Bullet Point"
                                                />
                                            </div>
                                        )}
                                        {block.blockType === "paragraph" ? (
                                            <RichTextEditor
                                                value={block.content}
                                                onChange={(val) => updateBlock(index, { content: val })}
                                                placeholder="Write something compelling..."
                                                className="text-base text-gray-800 dark:text-gray-100 leading-relaxed font-medium"
                                            />
                                        ) : (
                                            <AutoExpandingTextarea
                                                value={block.content}
                                                onChange={(val) => updateBlock(index, { content: val })}
                                                placeholder={`${block.blockType.toUpperCase()} Heading...`}
                                                className="text-xl font-black text-gray-900 dark:text-white tracking-tight"
                                            />
                                        )}
                                    </div>
                                ) : null}

                                {block.blockType === "location" && (
                                    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-dashed border-gray-200 dark:border-zinc-700">
                                        <div className="flex items-center gap-3 mb-4 text-red-600">
                                            <MapPin className="h-5 w-5" />
                                            <span className="text-sm font-bold uppercase tracking-widest">Location Widget</span>
                                        </div>
                                        <select
                                            className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none"
                                            value={block.locationId || ""}
                                            onChange={e => updateBlock(index, { locationId: e.target.value || undefined, restaurantId: undefined })}
                                        >
                                            <option value="">Select a location to suggest top places</option>
                                            {locations.map(loc => (
                                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {block.blockType === "restaurant" && (
                                    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-dashed border-gray-200 dark:border-zinc-700">
                                        <div className="flex items-center gap-3 mb-4 text-red-600">
                                            <Utensils className="h-5 w-5" />
                                            <span className="text-sm font-bold uppercase tracking-widest">Restaurant Widget</span>
                                        </div>
                                        <SearchableSelect
                                            options={restaurants.map(r => ({ value: r.id, label: r.name }))}
                                            value={block.restaurantId || ""}
                                            onChange={(val) => updateBlock(index, { restaurantId: val || undefined, locationId: undefined })}
                                            placeholder="Search for a specific restaurant to showcase..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Final Insertion Point */}
                <div className="relative mt-8 group flex flex-col items-center">
                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-red-100 dark:bg-zinc-800 -translate-y-1/2" />
                    <button
                        type="button"
                        onClick={() => setInsertIndex(contentBlocks.length)}
                        className="relative z-10 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-red-200 text-red-600 font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-95"
                    >
                        <Plus className="h-4 w-4" /> Add Content Block
                    </button>
                </div>
            </div>

            {/* Toolbox Overlay */}
            {insertIndex !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[32px] p-8 shadow-2xl relative">
                        <button
                            onClick={() => setInsertIndex(null)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-400" />
                        </button>

                        <div className="flex items-center gap-2 mb-8">
                            <Plus className="h-5 w-5 text-red-600" />
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Choose Component</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Structure</h4>
                                <WidgetButton icon={<Type className="h-4 w-4 text-blue-500" />} label="Heading H2" onClick={() => addBlock("h2", insertIndex)} />
                                <WidgetButton icon={<Type className="h-4 w-4 text-blue-400" />} label="Heading H3" onClick={() => addBlock("h3", insertIndex)} />
                                <WidgetButton icon={<Type className="h-4 w-4 text-blue-300" />} label="Heading H4" onClick={() => addBlock("h4", insertIndex)} />
                                <WidgetButton icon={<Type className="h-4 w-4 text-green-500" />} label="Paragraph" onClick={() => addBlock("paragraph", insertIndex)} />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Smart Widgets</h4>
                                <WidgetButton icon={<MapPin className="h-4 w-4 text-red-500" />} label="Location Guide" onClick={() => addBlock("location", insertIndex)} />
                                <WidgetButton icon={<Utensils className="h-4 w-4 text-orange-500" />} label="Restaurant Card" onClick={() => addBlock("restaurant", insertIndex)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function RichTextEditor({ value, onChange, placeholder, className }: { value: string, onChange: (val: string) => void, placeholder: string, className?: string }) {
    const contentEditableRef = useRef<HTMLDivElement>(null);

    // Sync initial value but don't overwrite if user is typing
    useEffect(() => {
        if (contentEditableRef.current && contentEditableRef.current.innerHTML !== value) {
            // Only update if significantly different to avoid cursor jumps, simpler for now
            // But strict sync is hard with contentEditable.
            // Just set initial value or if empty
            if (value === "" && contentEditableRef.current.innerHTML !== "") {
                contentEditableRef.current.innerHTML = "";
            } else if (value && contentEditableRef.current.innerHTML === "") { // primitive initial load
                contentEditableRef.current.innerHTML = value;
            }
        }
    }, [value]); // careful with this dep

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const html = e.currentTarget.innerHTML;
        onChange(html);
    };

    return (
        <div
            ref={contentEditableRef}
            contentEditable
            onInput={handleInput}
            className={`w-full bg-transparent outline-none min-h-[1.5em] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 ${className} [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-5`}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
            style={{ whiteSpace: 'pre-wrap' }}
        />
    );
}

function AutoExpandingTextarea({ value, onChange, placeholder, className, id }: { value: string, onChange: (val: string) => void, placeholder: string, className?: string, id?: string }) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-transparent outline-none resize-none overflow-hidden placeholder-gray-300 ${className}`}
            rows={1}
        />
    );
}

function FormattingButton({ icon, onClick, label }: { icon: React.ReactNode, onClick: () => void, label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md text-gray-500 dark:text-gray-400 transition-colors"
        >
            {icon}
        </button>
    );
}

function WidgetButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full group flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700 border border-transparent hover:border-gray-200 dark:hover:border-zinc-600 transition-all hover:shadow-sm"
        >
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-gray-100 dark:ring-zinc-800 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{label}</span>
            <Plus className="h-3 w-3 ml-auto text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}

function SearchableSelect({ options, value, onChange, placeholder }: { options: { value: string, label: string }[], value: string, onChange: (val: string) => void, placeholder: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white cursor-pointer"
            >
                <span className={selectedOption ? "" : "text-gray-400"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-xl max-h-64 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-100 dark:border-zinc-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border-none rounded-lg text-xs outline-none"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className={`px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors ${value === opt.value ? "bg-red-50 text-red-600" : "hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"}`}
                                >
                                    {opt.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-xs text-gray-400 text-center">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
