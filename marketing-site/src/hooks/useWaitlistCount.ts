import { useState, useEffect } from "react";

interface WaitlistCountResponse {
  success: boolean;
  message: string;
  totalCount?: number;
}

export function useWaitlistCount() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = async () => {
    try {
      const response = await fetch("/api/waitlist/count");
      const data: WaitlistCountResponse = await response.json();

      if (data.success && typeof data.totalCount === "number") {
        setCount(data.totalCount);
      } else {
        setError("Failed to fetch waitlist count");
      }
    } catch (err) {
      console.error("Error fetching waitlist count:", err);
      setError("Failed to fetch waitlist count");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return { count, isLoading, error, refresh: fetchCount };
}
