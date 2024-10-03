import { useEffect } from "react"; // Importing the useEffect hook from React
import { useRouter } from "next/router"; // Importing the useRouter hook from Next.js

const Custom404 = () => {
  const router = useRouter(); // Initializing the router for navigation

  useEffect(() => {
    // Effect to check user session and handle redirection
    const userSession = localStorage.getItem("user_session"); // Retrieve user session from localStorage

    // Check if user session exists
    if (userSession) {
      const session = JSON.parse(userSession); // Parse the user session

      // If session is valid and user is logged in, redirect to home page
      if (session && session.loggedIn) {
        router.push("/home"); // Redirect to the home page
      } else {
        router.push("/"); // Redirect to the login page if not logged in
      }
    } else {
      router.push("/"); // Redirect to the login page if no session exists
    }
  }, [router]); // Dependency array includes router to avoid stale closures

  return null; // No UI will be rendered as redirection occurs immediately
};

export default Custom404; // Exporting the Custom404 component
