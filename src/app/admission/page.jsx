import ProtectedRoute from "../../components/ProtectedRoute";
import AdmissionForm from "../../components/AdmissionForm";

export default function AdmissionPage() {
  return (
    <ProtectedRoute>
      <div>
        <AdmissionForm />
      </div>
    </ProtectedRoute>
  );
}
