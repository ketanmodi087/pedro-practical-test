import { useEffect } from "react"; // Importing the useEffect hook from React
import { useRouter } from "next/router"; // Importing the useRouter hook from Next.js
import AuthForm from "../components/AuthForm"; // Importing the AuthForm component

const AuthPage = () => {
  const router = useRouter(); // Initializing the router for navigation

  useEffect(() => {
    // Effect to check if a user session exists in localStorage
    const checkUserSession = () => {
      // Retrieve the user session from localStorage
      const session = localStorage.getItem("user_session");

      // If a session exists, redirect the user to the home page
      if (session) {
        router.push("/home");
      }
    };

    checkUserSession(); // Execute the session check function
  }, [router]); // Dependency array includes router to avoid stale closures

  return <AuthForm />; // Render the AuthForm component
};

export default AuthPage; // Export the AuthPage component
