import { useEffect, useState } from "react"; // Import React's hooks
import { useRouter } from "next/router"; // Import Next.js useRouter hook for navigation
import { supabase } from "../api/database/supabaseClient"; // Import the Supabase client instance

const Home = () => {
  const router = useRouter(); // Initialize the router for programmatic navigation
  const [loading, setLoading] = useState(true); // State to handle loading indicator

  // useEffect hook to check if the user is logged in on component mount
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); // Get the current user session from Supabase

      // If no session exists, redirect the user to the login page
      if (!session) {
        router.push("/"); // Redirect to the login page if no user is logged in
      } else {
        setLoading(false); // If user is logged in, stop the loading state
      }
    };

    checkSession(); // Call the function to check the session
  }, [router]); // Dependency on 'router' to ensure effect runs when the router changes

  // Function to handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Sign out the user via Supabase

    router.push("/"); // Redirect the user to the login page after logging out
  };

  // Render a loading indicator while session is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-3xl font-semibold text-center mb-4">
          Welcome to the Home Page!
        </h1>
        <p className="text-center mb-6">
          You are logged in. Explore the features of the application.
        </p>
        <button onClick={handleLogout} className="btn btn-primary w-full mt-4">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home; // Export the Home component
