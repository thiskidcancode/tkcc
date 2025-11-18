"use client";
import { useState } from "react";

interface WaitlistFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface WaitlistResponse {
  success: boolean;
  message: string;
  position?: number;
  totalCount?: number;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function WaitlistForm(props: WaitlistFormProps) {
  const { onClose } = props;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    twilioOptIn: false,
    honeypot: "", // Bot detection field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<WaitlistResponse | null>(null);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formStartTime] = useState(Date.now());

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.trim().length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return "Name can only contain letters, spaces, hyphens, and apostrophes";
    if (name.trim().split(' ').length < 2) return "Please enter your full name";
    if (/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(name.trim()) === false) return "Please enter a valid name";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.trim())) return "Please enter a valid email address";
    if (email.includes('..')) return "Invalid email format";
    if (email.startsWith('.') || email.endsWith('.')) return "Invalid email format";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return "Phone number is required";
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10 && !(cleaned.length === 11 && cleaned[0] === '1')) {
      return "Please enter a valid US phone number";
    }
    return undefined;
  };

  const detectBot = (): string | undefined => {
    // Honeypot check
    if (formData.honeypot) return "Bot detected";
    
    // Timing check - too fast submission
    const timeTaken = Date.now() - formStartTime;
    if (timeTaken < 3000) return "Please take your time filling out the form";
    
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    errors.name = validateName(formData.name);
    errors.email = validateEmail(formData.email);
    errors.phone = validatePhone(formData.phone);
    
    const botError = detectBot();
    if (botError) {
      setError(botError);
      return false;
    }
    
    setValidationErrors(errors);
    return !errors.name && !errors.email && !errors.phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { honeypot, ...submitData } = formData;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Add Vercel protection bypass for staging
      if (process.env.NEXT_PUBLIC_VERCEL_PROTECTION_BYPASS) {
        headers["x-vercel-protection-bypass"] = process.env.NEXT_PUBLIC_VERCEL_PROTECTION_BYPASS;
      }
      
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers,
        body: JSON.stringify(submitData),
      });

      const data: WaitlistResponse = await res.json();
      setResponse(data);

      if (!data.success) {
        setError(data.message);
      } else if (props.onSuccess) {
        props.onSuccess();
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
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
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
            onClick={() => {
              if (props.onSuccess) props.onSuccess();
              onClose();
            }}
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
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />
          
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white ${
                validationErrors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your full name (e.g., John Smith)"
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
            )}
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white ${
                validationErrors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
            )}
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white ${
                validationErrors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
            )}
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
