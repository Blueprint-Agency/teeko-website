"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminEsimPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/esim/packages");
    }, [router]);

    return null;
}
