"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminEsimPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/sim/packages");
    }, [router]);

    return null;
}
