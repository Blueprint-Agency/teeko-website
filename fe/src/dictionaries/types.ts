/**
 * Dictionary types. English (`./en`) is the reference: every BM and 中文
 * area file is typed against it, so a missing or misspelt key in either
 * language is a compile error.
 *
 * Values are plain strings, never functions, so the whole dictionary can be
 * handed to client components through LocaleProvider. Interpolate with
 * `fmt(dict.x.y, { name })` from `@/lib/i18n`, using `{name}` placeholders.
 */
import type en from "./en";

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

export type Dictionary = Widen<typeof en>;
export type DictionaryArea<K extends keyof Dictionary> = Dictionary[K];
