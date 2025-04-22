"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PaymentContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("canceled")) {
      toast.error("Payment was canceled");
    }

    if (searchParams.get("success")) {
      toast.success("Payment was successful!");
    }
  }, [searchParams]);

  return null;
}
