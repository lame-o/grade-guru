# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ffaf6109-51d1-46fc-b407-006ea2ef8960

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ffaf6109-51d1-46fc-b407-006ea2ef8960) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ffaf6109-51d1-46fc-b407-006ea2ef8960) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

### Installing Node.js and npm

#### Windows
1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
2. Open PowerShell and verify installation:
   ```powershell
   node --version
   npm --version
   ```

#### macOS
1. Using Homebrew:
   ```bash
   brew install node
   ```
2. Or using nvm (recommended):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install node
   nvm use node
   ```

#### Linux
1. Using nvm:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install node
   nvm use node
   ```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure

```
<repository-name>/
├── src/
│   ├── components/     # React components
│   ├── integrations/   # External service integrations
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── App.tsx        # Root component
├── public/            # Static assets
└── index.html         # Entry point
```

### Environment Setup Tips

#### Windows-Specific
- If you encounter EACCES errors, run PowerShell as Administrator
- For PDF processing, ensure Microsoft Visual C++ Redistributable is installed

#### macOS-Specific
- If you encounter permission issues:
  ```bash
  sudo chown -R $USER /usr/local/lib/node_modules
  ```
- For M1/M2 Macs, you might need Rosetta 2:
  ```bash
  softwareupdate --install-rosetta
  ```

#### Linux-Specific
- Install build essentials:
  ```bash
  sudo apt-get install build-essential
  ```
- For PDF processing:
  ```bash
  sudo apt-get install libgbm-dev
  ```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **PDF Viewer not working**
   - Ensure you have the latest version of react-pdf
   - Check if PDF URLs are properly encoded
   - Verify Supabase storage permissions

2. **Build Errors**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: 
     ```bash
     rm -rf node_modules
     npm install
     ```

3. **CORS Issues**
   - Check Supabase storage bucket CORS configuration
   - Verify API endpoints are properly configured

For more help, please open an issue on the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
