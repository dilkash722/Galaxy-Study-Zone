"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#4CAF50",
  "#F44336",
  "#2196F3",
  "#FF9800",
  "#9C27B0",
  "#00BCD4",
];

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchSheets() {
      try {
        const sheetId = "1GG6mhqq1cW9NAU9skZBn-qnwwhO_8Qz39NWmAQGAz4Y";
        const fetchSheet = async (sheetName) => {
          const res = await fetch(
            `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`
          );
          const text = await res.text();
          const json = JSON.parse(text.substring(47).slice(0, -2));
          const headers = json.table.cols.map((col) => col.label);
          return json.table.rows.map((row) => {
            let obj = {};
            row.c.forEach((cell, i) => {
              obj[headers[i]] = cell ? cell.v : "";
            });
            return obj;
          });
        };
        const [admissions, payments] = await Promise.all([
          fetchSheet("Admissions"),
          fetchSheet("Payments"),
        ]);
        const merged = admissions.map((adm) => ({
          ...adm,
          payments: payments.filter((p) => p.StudentID === adm.StudentID),
        }));
        setStudents(merged);
        setSelectedStudent(merged[0]);
      } catch (err) {
        console.error("Error fetching sheets:", err);
      }
    }
    fetchSheets();
  }, []);

  if (!selectedStudent) return <p className="p-6">Loading...</p>;

  // Total Students
  const totalStudents = students.length;

  // All payments array
  const allPayments = students.flatMap((s) => s.payments);

  // Total Amount (sum of all payments)
  const totalAmount = allPayments.reduce(
    (acc, p) => acc + (parseFloat(p.Amount) || 0),
    0
  );

  // Total Collection (only paid payments)
  const totalCollection = allPayments.reduce((acc, p) => {
    if (p.PaymentStatus?.toLowerCase() === "paid") {
      return acc + (parseFloat(p.Amount) || 0);
    }
    return acc;
  }, 0);

  // Total Due (amount - collection)
  const totalDue = totalAmount - totalCollection;

  // Bar chart data: students count per class
  const barData = Object.entries(
    students.reduce((acc, s) => {
      acc[s.Class] = (acc[s.Class] || 0) + 1;
      return acc;
    }, {})
  ).map(([cls, count]) => ({ class: cls, students: count }));

  // Pie chart for selected student
  const monthlyFee = parseFloat(selectedStudent.TuitionFees) || 0;
  let pieData = [];
  let totalUnpaid = 0;
  selectedStudent.payments.forEach((p) => {
    const amt = parseFloat(p.Amount) || monthlyFee;
    if (p.PaymentStatus?.toLowerCase() === "paid") {
      pieData.push({ name: `${p.PaymentMonth} - Paid`, value: amt });
    } else {
      totalUnpaid += amt;
      pieData.push({ name: `${p.PaymentMonth} - Unpaid`, value: amt });
    }
  });
  if (totalUnpaid > 0)
    pieData.push({ name: `Total Due - ₹${totalUnpaid}`, value: totalUnpaid });

  // Search filter
  const filteredStudents = students.filter((s) =>
    s.StudentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 flex flex-col gap-6 mt-18 mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side student list */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow p-4 max-h-[445px] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <input
            type="text"
            placeholder="Search student..."
            className="w-full mb-3 p-2 rounded-xl shadow-sm bg-gray-100 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredStudents.map((s) => {
            const studentMonthlyFee = parseFloat(s.TuitionFees) || 0;
            let unpaidMonths = s.payments.filter(
              (p) => p.PaymentStatus?.toLowerCase() !== "paid"
            ).length;
            return (
              <div
                key={s.StudentID}
                className={`p-3 mb-3 rounded-xl cursor-pointer shadow-md transition-colors duration-200 ${
                  selectedStudent.StudentID === s.StudentID
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 hover:bg-blue-600 hover:text-white"
                }`}
                onClick={() => setSelectedStudent(s)}
              >
                <p className="font-semibold">{s.StudentName}</p>
                <p className="text-sm">Father: {s.FatherName}</p>
                <p className="text-xs">
                  Class: {s.Class} • Fees: ₹{studentMonthlyFee} •{" "}
                  {unpaidMonths > 0 ? "Pending" : "Cleared"}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right side: Cards + Charts */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <CardSmall
              title="Total Students"
              value={totalStudents}
              color="blue"
            />
            <CardSmall
              title="Total Amount"
              value={`₹${totalAmount}`}
              color="purple"
            />
            <CardSmall
              title="Total Collection"
              value={`₹${totalCollection}`}
              color="green"
            />
            <CardSmall title="Total Due" value={`₹${totalDue}`} color="red" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className=" text-gray-800 text-center mb-3">Total Student</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData}>
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className=" text-gray-800 text-center mb-3">
                {selectedStudent.StudentName}
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact Card Component
function CardSmall({ title, value, color }) {
  const colorMap = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center hover:shadow-lg transition">
      <h3 className="text-gray-700 font-semibold text-sm">{title}</h3>
      <p className={`text-xl font-bold mt-1 ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
