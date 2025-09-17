"use client";

import { useEffect, useState } from "react";
import { isLoggedIn } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login"); // redirect to login if not logged in
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) return null; // show nothing until check is done
  return <>{children}</>;
}
