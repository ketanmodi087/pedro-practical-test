import { supabase } from '../database/supabaseClient'; // Import the Supabase client instance
import * as bcrypt from 'bcryptjs'; // Import bcrypt for password hashing and comparison

// Define the authService object with login and signup methods
export const authService = {
  /**
   * Logs in a user with the provided email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An object containing the status code and a success message or throws an error.
   */
  async login(email: string, password: string): Promise<{ statusCode: number; message: string; user?: { email: string } }> {
    // Validate input parameters
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      // Fetch user data from the Supabase database
      const { data, error } = await supabase
        .from("users")
        .select("email, password")
        .eq("email", email)
        .single(); // Ensure only one record is retrieved

      // Check for errors in data retrieval
      if (error || !data) {
        throw new Error("Invalid email or password");
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, data.password);

      // Validate the password
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Return success response
      return {
        statusCode: 200,
        message: "Login successful!",
        user: { email: data.email }, // Optionally return more user information
      };
    } catch (error) {
      // Handle and throw errors appropriately
      throw new Error((error as Error).message || "Something went wrong during login");
    }
  },

  /**
   * Signs up a new user with the provided email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An object containing the status code and a success message or throws an error.
   */
  async signup(email: string, password: string): Promise<{ statusCode: number; message: string }> {
    // Validate input parameters
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Check if the email is already registered
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    // If the user already exists, throw an error
    if (existingUser || findError) {  // Use findError to handle any errors from the query
      throw new Error("Email is already registered.");
    }

    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert the new user into the Supabase database
      const { data, error } = await supabase
        .from("users")
        .insert([{ email, password: hashedPassword }])
        .select()
        .single();

      // Check for errors during user creation
      if (error || !data) {
        throw new Error(error.message || "Error creating user");
      }

      // Return success response
      return {
        statusCode: 200,
        message: "Sign Up successful! You can now log in.",
      };
    } catch (error) {
      // Handle and throw errors appropriately
      throw new Error((error as Error).message || "Unable to Sign up.");
    }
  },
};
