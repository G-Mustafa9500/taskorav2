import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create client with user's token to check permissions
    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user is super_admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError || roleData?.role !== "super_admin") {
      throw new Error("Only Super Admins can create users");
    }

    // Get request body
    const { email, password, fullName, role } = await req.json();

    if (!email || !password || !fullName || !role) {
      throw new Error("Missing required fields");
    }

    if (role !== "manager" && role !== "staff") {
      throw new Error("Invalid role. Must be 'manager' or 'staff'");
    }

    // Create user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) throw createError;
    if (!newUser.user) throw new Error("Failed to create user");

    // Create profile
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      user_id: newUser.user.id,
      email,
      full_name: fullName,
    });

    if (profileError) {
      // Cleanup: delete user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      throw profileError;
    }

    // Assign role
    const { error: roleInsertError } = await supabaseAdmin.from("user_roles").insert({
      user_id: newUser.user.id,
      role,
    });

    if (roleInsertError) {
      // Cleanup
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      throw roleInsertError;
    }

    return new Response(
      JSON.stringify({ success: true, userId: newUser.user.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
