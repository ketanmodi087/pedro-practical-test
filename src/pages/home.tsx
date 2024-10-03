import { useEffect } from "react"; // Importing the useEffect hook from React
import { useRouter } from "next/router"; // Importing the useRouter hook from Next.js

const Home = () => {
  const router = useRouter(); // Initializing the router for navigation

  useEffect(() => {
    // Effect to check if the user is logged in
    const user = JSON.parse(localStorage.getItem("user_session") || "{}"); // Retrieve user session from localStorage

    // If user is not logged in, redirect to the login page
    if (!user?.loggedIn) {
      router.push("/"); // Redirecting to the root path
    }
  }, [router]); // Dependency array includes router to avoid stale closures

  const handleLogout = () => {
    // Clear user session from localStorage
    localStorage.removeItem("user_session"); // Remove the user session

    // Redirect to login page
    router.push("/"); // Redirecting to the root path
  };

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

export default Home; // Exporting the Home component
