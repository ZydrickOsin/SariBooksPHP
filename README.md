# SariBooksPH

SariBooksPH is a web application that helps businesses in the Philippines with bookkeeping and taxation compliance.

## Database Setup with Supabase

This project uses Supabase for database and authentication. Follow these steps to set up your database:

1. **Set up Environment Variables**:

   Make sure your Supabase environment variables are properly set in your project:

   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key
   JWT_SECRET=your-jwt-secret
   \`\`\`

2. **Initialize Database**:

   Run the SQL script in `db/schema.sql` in your Supabase SQL editor to create the necessary tables and setup Row Level Security.

3. **Run the Application**:

   \`\`\`bash
   npm run dev
   \`\`\`

## Authentication Flow

1. Users register through the registration form
2. Supabase Auth creates an authentication record
3. A corresponding record is created in our custom `users` table
4. Users can then log in and proceed to the onboarding process

## Onboarding Process

1. Users fill out business information
2. Users provide tax details
3. Users set bookkeeping preferences
4. Onboarding is completed and users are redirected to the dashboard

## Database Schema

- **users**: Stores user profile information
- **businesses**: Contains business profile data
- **tax_profiles**: Stores tax-related information for businesses
- **bookkeeping_preferences**: Contains user preferences for bookkeeping

## Security

- Row Level Security (RLS) is implemented on all tables
- Each user can only access their own data
- Authentication is handled securely by Supabase
- Passwords are hashed and stored securely

## Next Steps

- Implement email verification
- Add password recovery flow
- Build transaction management features
- Create reports and analytics dashboards
\`\`\`

This completes the Supabase database setup for your SariBooksPH application. The implementation:

1. Creates SQL tables with proper relationships and Row Level Security
2. Integrates Supabase authentication
3. Updates server actions to use Supabase
4. Provides middleware for route protection
5. Includes comprehensive error handling
6. Sets up a complete onboarding flow

To use this implementation:
1. Run the SQL script in your Supabase SQL editor
2. Set up the environment variables in your Vercel project
3. Deploy the application

Now your SariBooksPH application has a fully functional backend with Supabase handling the database and authentication!
