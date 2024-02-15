# User Management Dashboard

This is a sample project that allwos users management of organizational roles, API key distribution, and more, with a robust authentication system powered by Supabase.

Tech Stack:

-   Supabase
-   Next.js
-   TailwindCSS

## Features

-   **Supabase Authentication**: Secure and straightforward user authentication.
-   **Database Management**: Utilize Supabase for backend operations including database management with Row Level Security (RLS).
-   **Authorization and Access Control**: Relies on Supabase's RLS policies to guarantee authorized access to data.
-   **Dynamic UI with TailwindCSS and shadCN UI**: Build responsive and modern user interfaces.
-   **Comprehensive Role Management**: Efficiently manage user roles within organizations which can be extended to have granular access control.

## Getting Started

### Prerequisites

-   Node.js installed on your system.
-   A Supabase account and project for backend services.

### Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-github/carbon-customer-portal.git
    cd carbon-customer-portal
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    Create a `.env.local` file at the root of your project and add the following lines:

    ```plaintext
    NEXT_PUBLIC_SUPABASE_URL=YourSupabaseURL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YourSupabaseAnonKey
    ```

    Replace `YourSupabaseURL` and `YourSupabaseAnonKey` with your actual Supabase project details.

4. **Database setup**
   You can use the `supabase.sql` file to create the necessary tables and policies in your Supabase project. This is not added yet, but will be added soon. To understand the schema and operations, refer to the Database Schema and Operations section below.

### Running the project

-   **Development mode**

    ```bash
    npm run dev
    ```

-   **Production build**

    ```bash
    npm run build
    npm start
    ```

## Code Structure

-   **App**: Project relies on the latest `app` directory paradigm of Nextjs to create file-based routing.
-   **Components**: Reusable UI components are located in the `components` directory. This is where we install ShadCN UI components to inside the `components/ui` directory.
-   **Utils**: The `utils` directory contains utility functions and custom hooks for interacting with Supabase and handling application auth logic.
-   **Types**: The `types` directory contains custom TypeScript types and interfaces used throughout the project such as `User`, `Organization`, `Role`, that come from the DB schema.
-   **Stores**: The `stores` directory contains the global state management using Zustand.
-   **Hooks**: The `hooks` directory contains custom hooks for handling global state and other UI logic. Some hooks sync the DB data with the global state to always have the latest data.

## Database Schema and Operations

### Schema Overview

-   **Organizations**: Track organizations with details including creation and admin information.
-   **Roles**: Define user roles within organizations.
-   **UserOrgRoles**: Associate users with organizations and their roles.
-   **APIKeys**: Manage API keys for secure access to services.
-   **Users**: Special table that comes from and managed by Supabase. Stores user details including email, name, and other information.

### Workflow

1. **User Registration**: Utilizes Supabase Auth for secure signup and login.
2. **Organization Management**: Users can create organizations, with entries automatically managed in the `Organizations` table.
3. **Role Assignment**: Users are assigned roles within their organizations, facilitated by updates to the `UserOrgRoles` table.

## UI Flow

Guides the user through the process of logging in or signing up, joining or creating an organization, inviting other users, and managing API keys. The UI dynamically updates based on the user's interaction and organization's state.

## Contribution

We welcome contributions! Please read our CONTRIBUTING.md for guidelines on how to make this project better.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
