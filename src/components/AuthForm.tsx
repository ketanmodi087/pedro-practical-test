import { useState } from "react";
import { useRouter } from "next/router";
import { authService } from "../api/auth/auth.service"; // Import the service that handles authentication

// Main functional component for the authentication form
const AuthForm = () => {
  const router = useRouter(); // Hook for navigation in Next.js

  // State management for form fields and feedback
  const [email, setEmail] = useState(""); // To store the user's email
  const [password, setPassword] = useState(""); // To store the user's password
  const [isSignUp, setIsSignUp] = useState(false); // Flag to toggle between sign-up and log-in
  const [emailError, setEmailError] = useState(""); // Store email validation errors
  const [passwordError, setPasswordError] = useState(""); // Store password validation errors
  const [message, setMessage] = useState(""); // Feedback message for the user (success or error)
  const [isSuccess, setIsSuccess] = useState(false); // Success or failure flag

  // Utility function to validate email format using regex
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Utility function to validate password (at least 6 characters long)
  const isValidPassword = (password: string) => password.length >= 6;

  // Function to handle form submission for both sign-up and log-in
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Reset previous errors and messages
    setEmailError("");
    setPasswordError("");
    setMessage("");

    // Flag to track form validity
    let isValid = true;

    // Email validation
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Password validation
    if (!isValidPassword(password)) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    // If validation fails, stop form submission
    if (!isValid) return;

    try {
      let response; // Variable to store the response from the service call

      // Call the appropriate authentication service method based on the form state
      if (isSignUp) {
        response = await authService.signup(email, password); // Signup service call
      } else {
        response = await authService.login(email, password); // Login service call
      }

      // Display the response message (either success or error)
      setMessage(response.message);

      // Check if the operation was successful
      if (response.statusCode === 200) {
        setIsSuccess(true);

        // If login is successful, redirect to the home page
        if (!isSignUp) {
          router.push("/home");
        }

        // Clear form fields after successful operation
        setEmail("");
        setPassword("");
      } else {
        setIsSuccess(false); // If not successful, set failure state
      }
    } catch (error) {
      // If an error occurs, display the appropriate error message
      const errorMessage =
        typeof error === "object" && error.message ? error.message : error;
      setIsSuccess(false);
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        {/* Dynamic heading: Sign Up or Log In */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Sign Up" : "Log In"}
        </h2>

        {/* Form submission handler */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Feedback message */}
          {message && (
            <div
              className={`mt-4 text-center ${
                isSuccess ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          {/* Email input field */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            {emailError && (
              <div className="text-red-600 text-sm mt-1">{emailError}</div>
            )}
          </div>

          {/* Password input field */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            {passwordError && (
              <div className="text-red-600 text-sm mt-1">{passwordError}</div>
            )}
          </div>

          {/* Submit button */}
          <button type="submit" className="btn btn-primary w-full mt-4">
            {isSignUp ? "Sign Up" : "Log In"}
          </button>

          {/* Toggle between login and signup */}
          <p className="text-center text-gray-500 text-xs mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm; // Export the AuthForm component for use in other parts of the application
