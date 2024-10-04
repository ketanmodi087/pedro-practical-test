import { useEffect } from "react"; // Import React's useEffect hook for side effects
import { useRouter } from "next/router"; // Import Next.js useRouter hook for navigation
import { supabase } from "../api/database/supabaseClient"; // Import the Supabase client instance

// Custom 404 page component
const Custom404 = () => {
  const router = useRouter(); // Initialize the router for programmatic navigation

  // useEffect hook to check user session and redirect based on session status
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession(); // Fetch the current session

      // If the user session exists, redirect to the home page
      if (session) {
        router.push("/home"); // Redirect to home if the user is logged in
      } else {
        router.push("/"); // Redirect to the login page if no session is found
      }
    };

    checkSession(); // Invoke the session check function
  }, [router]); // Dependency on 'router' to ensure the effect runs when the router changes

  return null; // No UI will be rendered as redirection happens immediately
};

export default Custom404; // Export the component for use in Next.js routing
