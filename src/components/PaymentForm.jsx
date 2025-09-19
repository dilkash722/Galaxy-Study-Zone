"use client";
import React, { useState, useEffect } from "react";

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    fatherName: "",
    paymentMonth: "",
    paymentDate: "",
    amount: "",
    paymentStatus: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  // Google Sheet ID
  const SHEET_ID = "1GG6mhqq1cW9NAU9skZBn-qnwwhO_8Qz39NWmAQGAz4Y";

  // Auto-fill student info when Student ID changes
  const handleStudentIdChange = async (e) => {
    const studentId = e.target.value;
    setFormData({ ...formData, studentId });

    if (!studentId) {
      setFormData((prev) => ({ ...prev, studentName: "", fatherName: "" }));
      return;
    }

    try {
      const res = await fetch(
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Admissions`
      );
      let text = await res.text();
      // Remove Google Sheets extra chars
      const jsonData = JSON.parse(text.substring(47, text.length - 2));
      const rows = jsonData.table.rows;

      const student = rows
        .map((row) => ({
          studentId: row.c[0]?.v,
          studentName: row.c[2]?.v,
          fatherName: row.c[3]?.v,
        }))
        .find((s) => s.studentId === studentId);

      if (student) {
        setFormData((prev) => ({
          ...prev,
          studentName: student.studentName,
          fatherName: student.fatherName,
        }));
      } else {
        setFormData((prev) => ({ ...prev, studentName: "", fatherName: "" }));
      }
    } catch (err) {
      console.error(err);
      setFormData((prev) => ({ ...prev, studentName: "", fatherName: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.status === "success") {
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
        setFormData({
          studentId: "",
          studentName: "",
          fatherName: "",
          paymentMonth: "",
          paymentDate: "",
          amount: "",
          paymentStatus: "",
          remarks: "",
        });
      } else {
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center py-8 px-2 sm:px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-hidden mt-14">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white text-center py-6">
          <h1 className="text-2xl font-bold">Galaxy Study Zone</h1>
          <p className="text-lg">Payment Form</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 md:p-12 space-y-8">
          <section className="space-y-4">
            <h3 className="text-gray-700 font-semibold">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleStudentIdChange}
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
                label="Payment Month"
                name="paymentMonth"
                value={formData.paymentMonth}
                onChange={handleChange}
              />
              <InputField
                label="Payment Date"
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
              />
              <InputField
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
              <SelectField
                label="Payment Status"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                options={["Pending", "Paid", "Unpaid"]}
              />
              <InputField
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            {loading ? "Submitting..." : "Submit Payment"}
          </button>
        </form>
      </div>

      {/* Popups */}
      {showSuccessPopup && <Popup message="Payment successfully!" success />}
      {showErrorPopup && <Popup message="Something went wrong. Try again!" />}
    </div>
  );
}

// Input component
function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col">
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

// Select component
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

// Reusable Popup component
function Popup({ message, success }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex flex-col items-center space-y-3 w-80">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full ${
            success ? "bg-green-500" : "bg-red-500"
          } text-white text-2xl`}
        >
          {success ? "✓" : "✕"}
        </div>
        <span className="text-gray-900 font-semibold text-center">
          {message}
        </span>
      </div>
    </div>
  );
}
