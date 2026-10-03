import { Metadata } from 'next';
import '../globals.css';
import { RootDocument } from '@/components/layout/RootDocument';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
    title: 'Teeko Admin',
    robots: {
        index: false,
        follow: false,
    },
};

/**
 * The admin panel is its own root layout (English only, never indexed). The
 * public site's root is `app/[locale]/layout.tsx`. Moving between the two
 * is a full page load, which is fine for an admin crossing to the site.
 */
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RootDocument lang="en">
            <AdminLayoutClient>{children}</AdminLayoutClient>
        </RootDocument>
    );
}
