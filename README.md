# Math & Physics Solver to LaTeX

This project is a React application built with Vite that uses Google's Gemini AI to solve math and physics problems from images and output the solutions in LaTeX format.

## Setup

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Create `.env` file**:
    Create a file named `.env` in the root directory and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

## Development

Run the development server:

```bash
npm run dev
```

## Deployment on Vercel

To deploy this application on Vercel:

1.  Push your code to a GitHub repository.
2.  Log in to Vercel and import the project from GitHub.
3.  **Important**: In the Vercel project settings, go to **Settings > Environment Variables** and add:
    - Key: `GEMINI_API_KEY`
    - Value: `your_actual_api_key`
4.  Vercel will automatically detect the Vite build settings.
5.  Click **Deploy**.

The application is optimized for Vercel deployment with a `vercel.json` configuration for SPA routing.
