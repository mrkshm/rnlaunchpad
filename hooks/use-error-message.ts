import { useState } from "react";

export function useErrorMessage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return { errorMessage, setErrorMessage };
}
