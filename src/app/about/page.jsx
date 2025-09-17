// src/app/about/page.jsx
"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-gray-500 text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Galaxy Study Zone
          </h1>
          <p className="text-lg md:text-xl italic text-gray-600">
            "Jahaan Har Bachha Ek Taara Hai"
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white shadow rounded-3xl p-6 text-left transition duration-300">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="leading-relaxed mb-3">
            Galaxy Study Zone started on <strong>21 July 2025</strong>. Our
            center helps children learn in a fun and easy way. We teach students
            of classes 1 to 10 in both Hindi and English medium, and also guide
            senior secondary students. Our focus is to create an environment
            where learning becomes joyful, accessible, and effective.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Coaching started on 21 July 2025</li>
            <li>Classes 1 to 10 in Hindi & English</li>
            <li>Guidance for 12th class students</li>
            <li>Modern teaching methods and digital resources</li>
          </ul>
        </div>

        {/* Founder & Educator */}
        <div className="bg-white shadow rounded-3xl p-6 text-left transition duration-300">
          <h2 className="text-2xl font-semibold mb-4">Founder & Educator</h2>
          <ul className="space-y-3">
            <li>
              <strong>Name:</strong> Md Dilkash Alam
            </li>
            <li>
              <strong>About:</strong> Full Stack Web Developer & Software
              Engineer, running a coaching center to help students learn easily
              and confidently.
            </li>
            <li>
              <strong>Academic Qualification:</strong>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Secondary: High School Kanharia (BSEB)</li>
                <li>Senior Secondary: MBTA Islamia Sr. Sec School, Katihar</li>
                <li>BCA from BNMU, Madhepura</li>
                <li>MCA (Pursuing) Manipal University Jaipur</li>
              </ul>
            </li>
            <li>
              <strong>Contact:</strong> 9123194125, 7763937638
            </li>
          </ul>
        </div>

        {/* Technical Skills & Services */}
        <div className="bg-white shadow rounded-3xl p-6 text-left transition duration-300">
          <h2 className="text-2xl font-semibold mb-4">
            Technical Skills & Services
          </h2>
          <h3 className="font-semibold mb-2">Services We Provide:</h3>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Billing Software</li>
            <li>Student Management Software</li>
            <li>Attendance Management Software</li>
            <li>Admission & Registration System</li>
            <li>Custom Web Applications</li>
          </ul>
          <h3 className="font-semibold mb-2">Technical Skills:</h3>
          <p>
            <strong>Backend:</strong> Python, JavaScript, SQL, MySQL, MongoDB,
            Node.js, Express.js
          </p>
          <p>
            <strong>Frontend:</strong> React.js, Next.js, HTML, CSS, Tailwind
            CSS
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-3xl p-6 text-left transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Teach every child in a simple and fun way</li>
              <li>Help students grow confidence in studies</li>
              <li>Support students of classes 1 to 12</li>
              <li>Use modern teaching methods and digital tools</li>
            </ul>
          </div>
          <div className="bg-white shadow rounded-3xl p-6 text-left transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Create a happy and friendly learning environment</li>
              <li>Make learning enjoyable for every student</li>
              <li>Prepare students for a brighter future</li>
              <li>Bridge the gap between technology and education</li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white shadow rounded-3xl p-6 text-left transition duration-300">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <ul className="space-y-2">
            <li>
              <strong>Email:</strong> support@galaxystudyzone.com
            </li>
            <li>
              <strong>Phone:</strong> +91 9123194125, +91 7763937638
            </li>
            <li>
              <strong>Address:</strong> Galaxy Study Zone, Katihar, Bihar, India
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
