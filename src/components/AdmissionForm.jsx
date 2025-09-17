"use client";
import React, { useState } from "react";

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    studentId: "",
    admissionDate: "",
    studentName: "",
    fatherName: "",
    dob: "",
    gender: "",
    studentClass: "",
    parentMobile: "",
    aadhar: "",
    address: "",
    tuitionFees: "",
  });

  // Loading & popup states
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      const res = await fetch("/api/admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.status === "success") {
        setShowSuccessPopup(true);
        setFormData({
          studentId: "",
          admissionDate: "",
          studentName: "",
          fatherName: "",
          dob: "",
          gender: "",
          studentClass: "",
          parentMobile: "",
          aadhar: "",
          address: "",
          tuitionFees: "",
        });
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 3000);
      }
    } catch (error) {
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-2 sm:px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-md overflow-hidden mt-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white text-center py-6">
          <h1 className="text-2xl font-bold">Galaxy Study Zone</h1>
          <p className="text-lg">Admission Form</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 md:p-12 space-y-8">
          {/* Student Details */}
          <section className="space-y-4">
            <h3 className="text-gray-700 font-semibold">Student Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
              />
              <InputField
                label="Admission Date"
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
              />
              <InputField
                label="Student Name"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
              />
              <InputField
                label="Father Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
              />
              <InputField
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={["Male", "Female", "Other"]}
              />
            </div>
          </section>

          {/* Contact Details */}
          <section className="space-y-4">
            <h3 className="text-gray-700 font-semibold">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Parent Mobile"
                name="parentMobile"
                value={formData.parentMobile}
                onChange={handleChange}
              />
              <InputField
                label="Aadhar Number"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
              />
              <InputField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </section>

          {/* Academic Details */}
          <section className="space-y-4">
            <h3 className="text-gray-700 font-semibold">Academic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Class"
                name="studentClass"
                value={formData.studentClass}
                onChange={handleChange}
              />
              <InputField
                label="Tuition Fees"
                type="number"
                name="tuitionFees"
                value={formData.tuitionFees}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {/* ✅ Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex flex-col items-center space-y-3 w-80">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white text-2xl">
              &#10003;
            </div>
            <span className="text-gray-900 font-semibold text-center">
              Admission submitted successfully!
            </span>
          </div>
        </div>
      )}

      {/* ❌ Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex flex-col items-center space-y-3 w-80">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white text-2xl">
              &#10005;
            </div>
            <span className="text-gray-900 font-semibold text-center">
              Something went wrong. Try again!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Input Component
function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  fullWidth = false,
}) {
  return (
    <div
      className={fullWidth ? "flex flex-col md:col-span-2" : "flex flex-col"}
    >
      <label className="mb-1 font-medium text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        required
      />
    </div>
  );
}

// Reusable Select Component
function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-600">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        required
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
