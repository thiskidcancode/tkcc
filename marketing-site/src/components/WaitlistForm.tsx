"use client";
import { useState } from "react";

interface WaitlistFormProps {
  onClose: () => void;
}

interface WaitlistResponse {
  success: boolean;
  message: string;
  position?: number;
  totalCount?: number;
}

export default function WaitlistForm({ onClose }: WaitlistFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    twilioOptIn: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<WaitlistResponse | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: WaitlistResponse = await res.json();
      setResponse(data);

      if (data.success) {
        // Success - show position
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Waitlist submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (response?.success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to the Adventure!
          </h3>
          <p className="text-gray-600 mb-4">
            You&apos;re #{response.position} on our waitlist!
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {response.totalCount} future coders have joined so far. We&apos;ll
            notify you as soon as we launch!
          </p>
          <button
            onClick={onClose}
            className="bg-linear-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200"
          >
            Awesome!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Join the Coding Adventure!
          </h3>
          <p className="text-gray-600">
            Be the first to know when we launch our amazing coding platform!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="twilioOptIn"
              name="twilioOptIn"
              checked={formData.twilioOptIn}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="twilioOptIn" className="text-sm text-gray-600">
              📱 Send me SMS notifications about launch updates and coding tips!
              <span className="text-xs text-gray-500 block mt-1">
                Message and data rates may apply. You can opt out anytime by
                replying STOP.
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-linear-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:transform-none"
            >
              {isSubmitting ? "Joining..." : "Join Waitlist! 🎉"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
