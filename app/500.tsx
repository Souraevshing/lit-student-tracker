"use client";

import Link from "next/link";

export default function ServerError() {
  return (
    <div className="h-screen flex items-center justify-center bg-red-50 text-center p-4">
      <div className="max-w-lg">
        <h1 className="text-4xl font-bold text-red-700 mb-4">
          500 - Server Error
        </h1>
        <p className="text-gray-700 mb-6">
          Oops! Something went wrong on our end. Please try again later or
          contact support if the issue persists.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-600 text-white px-5 py-3 rounded-md hover:bg-red-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
