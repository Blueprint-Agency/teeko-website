"use client";

import { useState } from "react";
import { Copy, Languages, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LOCALE_LABEL, LOCALE_NAME, TRANSLATED_LOCALES, type TranslatedLocale } from "@/lib/i18n";

/**
 * Admin editor for the `translations` jsonb column (`{ ms?: {...}, zh?: {...} }`)
 * on restaurants, SIM packages, locations and settings. English stays in the
 * entity's normal fields; this only edits the BM and 中文 copies.
 *
 * The backend drops empty strings, so an untouched field is stored as
 * "not translated" and the public page falls back to English for it.
 */

export type TranslationFeature = { title: string; description: string };
export type TranslationValue = string | TranslationFeature[];
export type TranslationsState = Record<TranslatedLocale, Record<string, TranslationValue>>;

export interface TranslationField {
    key: string;
    label: string;
    kind: "text" | "textarea" | "features";
    rows?: number;
}

export function emptyTranslations(): TranslationsState {
    return { ms: {}, zh: {} };
}

/** Reads the API's `translations` value into editor state, keeping only known fields. */
export function translationsFromApi(raw: unknown, fields: TranslationField[]): TranslationsState {
    const state = emptyTranslations();
    if (!raw || typeof raw !== "object") return state;
    for (const locale of TRANSLATED_LOCALES) {
        const source = (raw as Record<string, unknown>)[locale];
        if (!source || typeof source !== "object") continue;
        for (const field of fields) {
            const value = (source as Record<string, unknown>)[field.key];
            if (field.kind === "features") {
                if (Array.isArray(value)) {
                    state[locale][field.key] = value
                        .filter((f) => f && typeof f === "object")
                        .map((f) => ({
                            title: String((f as Record<string, unknown>).title ?? ""),
                            description: String((f as Record<string, unknown>).description ?? ""),
                        }));
                }
            } else if (typeof value === "string") {
                state[locale][field.key] = value;
            }
        }
    }
    return state;
}

export function isFieldTranslated(state: TranslationsState, locale: TranslatedLocale, key: string): boolean {
    const value = state[locale][key];
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.some((f) => f.title.trim() || f.description.trim());
    return false;
}

interface Props {
    fields: TranslationField[];
    /** The field that decides whether a language counts as translated. */
    mainField: string;
    value: TranslationsState;
    onChange: (next: TranslationsState) => void;
    /** English values, shown as a reference and used by "copy English features". */
    english?: Record<string, unknown>;
    /** What the visitor sees, e.g. "restaurant page". */
    pageNoun?: string;
    /** Replaces the default explanation under the heading. */
    note?: React.ReactNode;
    className?: string;
}

const inputClass =
    "mt-1 block w-full rounded-md border border-gray-200 p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white";

export function TranslationsEditor({ fields, mainField, value, onChange, english, pageNoun = "page", note, className = "" }: Props) {
    const [active, setActive] = useState<TranslatedLocale>("ms");
    const mainLabel = fields.find((f) => f.key === mainField)?.label ?? mainField;

    const setField = (locale: TranslatedLocale, key: string, next: TranslationValue) => {
        onChange({ ...value, [locale]: { ...value[locale], [key]: next } });
    };

    const featuresOf = (locale: TranslatedLocale, key: string): TranslationFeature[] => {
        const current = value[locale][key];
        return Array.isArray(current) ? current : [];
    };

    const englishFeatures = (key: string): TranslationFeature[] => {
        const source = english?.[key];
        if (!Array.isArray(source)) return [];
        return source
            .filter((f) => f && typeof f === "object")
            .map((f) => ({
                title: String((f as Record<string, unknown>).title ?? ""),
                description: String((f as Record<string, unknown>).description ?? ""),
            }));
    };

    return (
        <div className={`rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 ${className}`}>
            <div className="flex items-start gap-2 mb-2">
                <Languages className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                    <h2 className="text-lg font-semibold dark:text-white">Translations</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {note ?? <>English is edited above. Until <strong>{mainLabel}</strong> is translated, the
                        {" "}{LOCALE_LABEL.ms} / {LOCALE_LABEL.zh} {pageNoun} shows the English text and is kept out of
                        Google&apos;s language links. Any field left empty falls back to English.</>}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 mb-4">
                {TRANSLATED_LOCALES.map((locale) => {
                    const done = isFieldTranslated(value, locale, mainField);
                    return (
                        <button
                            key={locale}
                            type="button"
                            onClick={() => setActive(locale)}
                            className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${active === locale
                                ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
                                }`}
                        >
                            {LOCALE_NAME[locale]}
                            <span className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${done
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
                                }`}>
                                {LOCALE_LABEL[locale]}: {done ? "translated" : "not translated"}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="space-y-4">
                {fields.map((field) => {
                    const englishValue = english?.[field.key];
                    const englishHint = typeof englishValue === "string" && englishValue.trim() ? englishValue : "";

                    if (field.kind === "features") {
                        const items = featuresOf(active, field.key);
                        const source = englishFeatures(field.key);
                        return (
                            <div key={field.key}>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <label className="block text-sm font-medium dark:text-gray-300">
                                        {field.label} ({LOCALE_LABEL[active]})
                                    </label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={source.length === 0}
                                            onClick={() => {
                                                if (items.length && !confirm(`Replace the ${LOCALE_NAME[active]} features with the English ones?`)) return;
                                                setField(active, field.key, source.map((f) => ({ ...f })));
                                            }}
                                        >
                                            <Copy className="h-4 w-4 mr-1" /> Copy English features
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setField(active, field.key, [...items, { title: "", description: "" }])}
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-3 mt-2">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    type="text"
                                                    className={inputClass}
                                                    placeholder={source[index]?.title || "Feature title"}
                                                    value={item.title}
                                                    onChange={(e) => {
                                                        const next = items.map((f, i) => (i === index ? { ...f, title: e.target.value } : f));
                                                        setField(active, field.key, next);
                                                    }}
                                                />
                                                <textarea
                                                    rows={2}
                                                    className={inputClass}
                                                    placeholder={source[index]?.description || "Feature description"}
                                                    value={item.description}
                                                    onChange={(e) => {
                                                        const next = items.map((f, i) => (i === index ? { ...f, description: e.target.value } : f));
                                                        setField(active, field.key, next);
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                aria-label="Remove feature"
                                                className="text-red-500 hover:text-red-700 p-1"
                                                onClick={() => setField(active, field.key, items.filter((_, i) => i !== index))}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {items.length === 0 && (
                                        <p className="text-xs text-gray-400 py-3 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-xl">
                                            No {LOCALE_NAME[active]} features. The English list is shown until you add some.
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    const current = value[active][field.key];
                    const text = typeof current === "string" ? current : "";
                    return (
                        <div key={field.key}>
                            <label className="block text-sm font-medium dark:text-gray-300">
                                {field.label} ({LOCALE_LABEL[active]})
                                {field.key === mainField && <span className="ml-1 text-xs text-gray-400">main field</span>}
                            </label>
                            {field.kind === "textarea" ? (
                                <textarea
                                    rows={field.rows ?? 3}
                                    lang={active}
                                    className={inputClass}
                                    value={text}
                                    onChange={(e) => setField(active, field.key, e.target.value)}
                                />
                            ) : (
                                <input
                                    type="text"
                                    lang={active}
                                    className={inputClass}
                                    value={text}
                                    onChange={(e) => setField(active, field.key, e.target.value)}
                                />
                            )}
                            {englishHint && (
                                <p className="mt-1 text-xs text-gray-400 line-clamp-2">English: {englishHint}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
