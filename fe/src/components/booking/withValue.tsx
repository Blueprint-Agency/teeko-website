import { Fragment, type ReactNode } from "react";

/**
 * Places a React node (a bold email, a package name) where `{key}` sits in a
 * dictionary string, so word order stays the translator's choice.
 */
export function withValue(template: string, key: string, node: ReactNode): ReactNode {
    const parts = template.split(`{${key}}`);
    return parts.map((part, i) => (
        <Fragment key={i}>
            {part}
            {i < parts.length - 1 && node}
        </Fragment>
    ));
}
