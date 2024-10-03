import "../../styles/globals.css"; // Importing global CSS styles for the application
import type { AppProps } from "next/app"; // Importing AppProps type from Next.js for type safety

// Main application component
function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Rendering the specific page component with its props
    <Component {...pageProps} />
  );
}

// Exporting the main application component
export default MyApp;
