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
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Professional color palette
const COLORS = [
  "#4CAF50", // Paid
  "#F44336", // Unpaid
  "#2196F3", // Total Due
  "#FF9800",
  "#9C27B0",
  "#00BCD4",
];

export default function StudentDashboard() {
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

  const monthlyFee = parseFloat(selectedStudent.TuitionFees) || 0;

  // Bar chart data with unique color per month
  const barData = selectedStudent.payments.map((p, i) => ({
    month: p.PaymentMonth,
    amount: parseFloat(p.Amount) || 0,
    fill: COLORS[i % COLORS.length],
  }));

  // Pie chart data
  let pieData = [];
  let totalPaid = 0;
  let totalUnpaid = 0;
  let paidMonths = 0;
  let unpaidMonths = 0;

  selectedStudent.payments.forEach((p) => {
    const amt = parseFloat(p.Amount) || monthlyFee;
    if (p.PaymentStatus.toLowerCase() === "paid") {
      totalPaid += amt;
      paidMonths++;
      pieData.push({ name: `${p.PaymentMonth} - Paid`, value: amt });
    } else {
      totalUnpaid += amt;
      unpaidMonths++;
      pieData.push({ name: `${p.PaymentMonth} - Unpaid`, value: amt });
    }
  });

  if (totalUnpaid > 0) {
    pieData.push({ name: `Total Due - ₹${totalUnpaid}`, value: totalUnpaid });
  }

  // Custom legend for PieChart
  const renderCustomLegend = () => {
    const items = [
      { label: `Paid - ${paidMonths} Month`, color: COLORS[0] },
      { label: `Unpaid - ${unpaidMonths} Month`, color: COLORS[1] },
      { label: `Total Due - ₹${totalUnpaid}`, color: COLORS[2] },
    ];

    return (
      <div className="flex justify-center gap-4 mt-2 flex-wrap">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const filteredStudents = students.filter((s) =>
    s.StudentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Class-wise line chart data
  const lineData = Object.entries(
    students.reduce((acc, s) => {
      acc[s.Class] = (acc[s.Class] || 0) + 1;
      return acc;
    }, {})
  ).map(([cls, count]) => ({ class: cls, students: count }));

  // Totals for cards
  const totalStudents = students.length;
  const totalAmount = students.reduce(
    (acc, s) => acc + (parseFloat(s.TuitionFees) || 0),
    0
  );
  const totalCollection = students.reduce((acc, s) => {
    let paid = 0;
    s.payments.forEach((p) => {
      if (p.PaymentStatus?.toLowerCase() === "paid")
        paid += parseFloat(p.Amount) || 0;
    });
    return acc + paid;
  }, 0);
  const totalDue = students.reduce((acc, s) => {
    let due = 0;
    s.payments.forEach((p) => {
      if (p.PaymentStatus?.toLowerCase() !== "paid")
        due += parseFloat(p.Amount) || monthlyFee;
    });
    return acc + due;
  }, 0);

  return (
    <div className="flex flex-col gap-6 p-6 mt-16 bg-gray-100 min-h-screen">
      {/* Top Feature Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Left: 4 summary cards */}
        <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h3 className="text-gray-700 font-semibold">Total Students</h3>
            <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h3 className="text-gray-700 font-semibold">Total Amount</h3>
            <p className="text-2xl font-bold text-purple-600">₹{totalAmount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h3 className="text-gray-700 font-semibold">Total Collection</h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{totalCollection}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h3 className="text-gray-700 font-semibold">Total Due</h3>
            <p className="text-2xl font-bold text-red-600">₹{totalDue}</p>
          </div>
        </div>

        {/* Right: Line Chart */}
        <div className="w-full md:w-1/2 bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-800 font-bold text-center mb-2">
            Class-wise Student Count
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Left: Student List */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-xl font-bold mb-3 text-gray-800">Students</h2>
          <input
            type="text"
            placeholder="Search student..."
            className="w-full mb-3 p-2 rounded-xl shadow-sm bg-gray-100 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {filteredStudents.map((s) => (
              <div
                key={s.StudentID}
                className={`p-3 mb-2 rounded-xl cursor-pointer shadow-md transition-colors duration-200 ${
                  selectedStudent.StudentID === s.StudentID
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 hover:bg-blue-600 hover:text-white"
                }`}
                onClick={() => setSelectedStudent(s)}
              >
                <p className="font-semibold">{s.StudentName}</p>
                <p className="text-sm">Father: {s.FatherName}</p>
                <p className="text-xs">
                  Class: {s.Class} • Gender: {s.Gender}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Student Report */}
        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Report - {selectedStudent.StudentName}
          </h2>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl shadow-sm">
            <p>
              <span className="font-semibold">Student ID:</span>{" "}
              {selectedStudent.StudentID}
            </p>
            <p>
              <span className="font-semibold">Father Name:</span>{" "}
              {selectedStudent.FatherName}
            </p>
            <p>
              <span className="font-semibold">Class:</span>{" "}
              {selectedStudent.Class}
            </p>
            <p>
              <span className="font-semibold">Gender:</span>{" "}
              {selectedStudent.Gender}
            </p>
            <p>
              <span className="font-semibold">Monthly Fees:</span> ₹{monthlyFee}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {totalUnpaid > 0 ? (
                <span className="text-red-500 font-semibold">Pending</span>
              ) : (
                <span className="text-green-600 font-semibold">Cleared</span>
              )}
            </p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-bold text-center mb-2 text-gray-700">
                Payment Status
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ cx, cy, midAngle, outerRadius, name }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 20;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      const monthFull = name.split(" ")[0];
                      const monthShort = monthFull.substring(0, 3);
                      const status = name.split("-")[1];
                      const labelText = `${monthShort}-${status}`;

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#333"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                          fontSize={12}
                        >
                          {labelText}
                        </text>
                      );
                    }}
                    labelLine={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend verticalAlign="bottom" content={renderCustomLegend} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-bold text-center mb-2 text-gray-700">
                Monthly Payments
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Months",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Amount (₹)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Bar dataKey="amount">
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
