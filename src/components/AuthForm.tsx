import { useState } from "react";
import { useRouter } from "next/router";
import { authService } from "../api/auth/auth.service"; // Importing the authentication service for handling login and signup

const AuthForm = () => {
  // Initializing router for navigation
  const router = useRouter();

  // State variables for form inputs and feedback messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Flag to toggle between login and signup
  const [emailError, setEmailError] = useState(""); // Error state for email
  const [passwordError, setPasswordError] = useState(""); // Error state for password
  const [message, setMessage] = useState(""); // To display messages to the user
  const [isSuccess, setIsSuccess] = useState(false); // Flag to indicate success or failure

  // Function to validate the email format
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return regex.test(email);
  };

  // Function to validate the password strength
  const isValidPassword = (password) => {
    return password.length >= 6; // Simple password length check
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Clear previous error messages
    setEmailError("");
    setPasswordError("");
    setMessage(""); // Clear previous messages

    // Perform validations
    let isValid = true;

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false; // Mark form as invalid
    }
    if (!isValidPassword(password)) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false; // Mark form as invalid
    }

    // If any validation fails, stop form submission
    if (!isValid) return;

    try {
      let response;
      // Call the appropriate service based on the form state (signup or login)
      if (isSignUp) {
        response = await authService.signup(email, password); // Call signup service without username
      } else {
        response = await authService.login(email, password); // Call login service
      }

      setMessage(response.message); // Display the response message

      // Check the response status code
      if (response.statusCode === 200) {
        if (!isSignUp) {
          // Store user session in localStorage upon successful login
          localStorage.setItem(
            "user_session",
            JSON.stringify({ email, loggedIn: true })
          );
          // Redirect to home page
          router.push("/home");
        } else {
          // Indicate success for signup
          setIsSuccess(true);
        }

        // Reset form values after successful request
        setEmail("");
        setPassword("");
      } else {
        // Indicate failure if status code is not 200
        setIsSuccess(false);
      }
    } catch (error) {
      // Handle error: check if it's an object and retrieve message
      const errorMessage =
        typeof error === "object" && error.message ? error.message : error; // Fallback to error if not an object

      setIsSuccess(false); // Indicate failure
      setMessage(errorMessage); // Display error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Sign Up" : "Log In"}{" "}
          {/* Dynamic heading based on form state */}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display success or error messages */}
          {message && (
            <div
              className={`mt-4 text-center ${
                isSuccess ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
          {/* Email input */}
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
              required // Ensure email is provided
            />
            {emailError && (
              <div className="text-red-600 text-sm mt-1">{emailError}</div>
            )}{" "}
            {/* Email error message */}
          </div>

          {/* Password input */}
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
              required // Ensure password is provided
            />
            {passwordError && (
              <div className="text-red-600 text-sm mt-1">{passwordError}</div>
            )}{" "}
            {/* Password error message */}
          </div>

          {/* Submit button */}
          <button type="submit" className="btn btn-primary w-full mt-4">
            {isSignUp ? "Sign Up" : "Log In"}
          </button>

          {/* Toggle between login and signup */}
          <p className="text-center text-gray-500 text-xs mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
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
