"use client";

import PaymentForm from "../../components/PaymentForm";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <div>
        <PaymentForm />
      </div>
    </ProtectedRoute>
  );
}
