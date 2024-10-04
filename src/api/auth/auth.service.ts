import { supabase } from "../database/supabaseClient"; // Import the Supabase client instance
// Define the authService object with login and signup methods
export const authService = {
  /**
   * Logs in a user with the provided email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An object containing the status code and a success message or throws an error.
   */
  async login(
    email: string,
    password: string
  ): Promise<{
    statusCode: number;
    message: string;
    user?: { email: string };
  }> {
    // Validate input parameters
    if (!email || !password) {
      return {
        statusCode: 400,
        message: "Email and password are required",
      };
    }

    try {
      // Use Supabase's built-in email/password authentication
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Check for errors during authentication
      if (error || !user) {
        return {
          statusCode: 401,
          message: error?.message ?? "Invalid email or password",
        };
      }

      // Return success response with user email
      return {
        statusCode: 200,
        message: "Login successful!",
        user: { email: user.user?.email || "" }, // Optionally return more user details
      };
    } catch (error) {
      // Handle any unexpected errors
      return {
        statusCode: 500,
        message:
          (error as Error).message || "Something went wrong during login",
      };
    }
  },

  /**
   * Signs up a new user with the provided email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An object containing the status code and a success message or throws an error.
   */
  async signup(
    email: string,
    password: string
  ): Promise<{ statusCode: number; message: string }> {
    // Validate input parameters
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      // Use Supabase's built-in sign-up method for email/password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      console.log('data: ', data);

      // Handle errors during the sign-up process
      if (error) {
        throw new Error(error.message || "Error creating user");
      }

      // Return success response when sign-up is successful
      return {
        statusCode: 200,
        message: "Sign Up successful! You can now log in.",
      };
    } catch (error) {
      // Handle unexpected errors
      throw new Error((error as Error).message || "Unable to Sign up.");
    }
  },
};
