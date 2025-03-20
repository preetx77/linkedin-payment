
-- Add RLS policies for linkedin_profiles table
ALTER TABLE IF EXISTS public.linkedin_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view any profile
CREATE POLICY IF NOT EXISTS "Users can view any linkedin profile" 
ON public.linkedin_profiles FOR SELECT 
TO authenticated
USING (true);

-- Users can insert their own profiles
CREATE POLICY IF NOT EXISTS "Users can insert their own linkedin profiles" 
ON public.linkedin_profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profiles
CREATE POLICY IF NOT EXISTS "Users can update their own linkedin profiles" 
ON public.linkedin_profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Add RLS policies for linkedin_posts table
ALTER TABLE IF EXISTS public.linkedin_posts ENABLE ROW LEVEL SECURITY;

-- Users can view any post
CREATE POLICY IF NOT EXISTS "Users can view any linkedin post" 
ON public.linkedin_posts FOR SELECT 
TO authenticated
USING (true);

-- Users can insert their own posts
CREATE POLICY IF NOT EXISTS "Users can insert their own linkedin posts" 
ON public.linkedin_posts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY IF NOT EXISTS "Users can update their own linkedin posts" 
ON public.linkedin_posts FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Add RLS policies for generated_posts table
ALTER TABLE IF EXISTS public.generated_posts ENABLE ROW LEVEL SECURITY;

-- Users can view their own generated posts
CREATE POLICY IF NOT EXISTS "Users can view their own generated posts" 
ON public.generated_posts FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own generated posts
CREATE POLICY IF NOT EXISTS "Users can insert their own generated posts" 
ON public.generated_posts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own generated posts
CREATE POLICY IF NOT EXISTS "Users can update their own generated posts" 
ON public.generated_posts FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can delete their own generated posts
CREATE POLICY IF NOT EXISTS "Users can delete their own generated posts" 
ON public.generated_posts FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
