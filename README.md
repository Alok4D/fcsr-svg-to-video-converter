# SVG to Video Studio (MP4 & ProRes MOV) 🎬

A powerful, high-performance web application that compiles animated SVGs (SMIL, CSS transitions) directly into high-quality H.264 MP4 and Apple ProRes 422 MOV video files. Built specifically for stock video creators, designers, and motion graphic artists to speed up their Adobe Stock, Shutterstock, and Pond5 marketplace submissions.

---

## 🔥 Key Features

### 1. Advanced Live SVG Editor & Presets
- **Monaco Code Editor:** Full XML syntax highlighting, auto-completion, and code folding for quick SVG editing.
- **Preset Library:** Instantly load visual presets (e.g. Glowing Neon Pulsing, Rotating Spinners, Cyberpunk Portals, Floating Waves).
- **Custom Uploads:** Upload your own animated SVG templates and render them instantly.

### 2. Live Sandbox Preview
- **Interactive Viewport:** Real-time preview of SMIL animations, CSS transforms, and inline SVG styles.
- **Pattern Switcher:** Toggle between dark checkers, light checkers, and transparent background modes.
- **Fullscreen Preview:** Inspect and check layout alignments before compiling.

### 3. Professional Render Engine (Remotion & FFmpeg)
- **High Resolution:** Supports HD, Full HD (1080p), and Ultra HD (4K / 3840x2160) configurations.
- **FPS Control:** Set frame rates from 24 FPS, 30 FPS, up to 60 FPS.
- **Dual Codec Support:**
  - **H.264 (MP4):** Compressed web-ready files with high visual quality.
  - **Apple ProRes 422 (MOV):** Professional production-grade video files for stock marketplaces.
- **Persistent Job Queue:** Powered by MongoDB & Mongoose. Page reloads will not lose render progress, and history is securely stored.

### 4. Marketplace SEO Kit (Multi-Provider AI)
- **Automatic Metadata Generation:** Creates SEO titles and high-converting tag clouds tailored specifically for stock websites.
- **Fallback Resiliency:** Checks for active API keys and falls back gracefully:
  1. **xAI Grok** (using Grok-3-mini or Grok-2)
  2. **OpenAI GPT** (using GPT-4o-mini)
  3. **Google Gemini** (using Gemini-2.5-flash)
- **Instant Exporters:** Download metadata as `.csv` spreadsheets (Adobe Stock bulk format) or `.txt` text files.

### 5. Automated CDN Cloud Hosting
- Rendered video files are automatically uploaded to your **Cloudinary CDN** and served instantly. 
- Local files are auto-cleaned after successful upload, saving server storage space.

---

## 🛠️ Local Installation & Setup Guide (কারো নিজের PC তে চালানোর নিয়ম)

If you want to run this project locally on your Windows, Mac, or Linux computer, follow these simple steps:

### 1. Prerequisites (যা যা ইন্সটল থাকতে হবে)
আপনি চাইলে কোনো ওয়েবসাইট থেকে ডাউনলোড না করে, সরাসরি আপনার কম্পিউটারের **Terminal (PowerShell)** ব্যবহার করে এক ক্লিকে সব ইন্সটল করতে পারেন:

* **Windows (PowerShell - Run as Administrator):**
  টার্মিনালে এই কমান্ডগুলো একে একে রান করুন (এটি অটোমেটিক ডাউনলোড এবং এনভায়রনমেন্ট ভ্যারিয়েবল সেটআপ করে নেবে):
  ```powershell
  # ১. Node.js ইন্সটল করার জন্য:
  winget install OpenJS.NodeJS
  
  # ২. FFmpeg ইন্সটল করার জন্য:
  winget install Gyan.FFmpeg
  
  # ৩. pnpm ইন্সটল করার জন্য:
  npm install -g pnpm
  ```

* **macOS (Terminal):**
  ```bash
  # Homebrew দিয়ে FFmpeg ইন্সটল করুন:
  brew install ffmpeg
  
  # pnpm ইন্সটল করুন:
  npm install -g pnpm
  ```

* **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt update && sudo apt install -y ffmpeg
  npm install -g pnpm
  ```

### 2. Clone and Install Dependencies
Open your terminal (PowerShell, Command Prompt, or Terminal) and run:
```bash
# Clone the repository
git clone https://github.com/Alok4D/svgtovideoconverter.git

# Move into the project directory
cd svgtovideoconverter

# Install packages
pnpm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# AI API Keys (At least one is required for SEO Kit)
GROK_API_KEY=your_xai_grok_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key

# Model Selection for Grok
TEXT_MODEL_BASIC=grok-3-mini

# Database Connection (MongoDB Atlas)
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/svg_to_video_db
MONGODB_DB_NAME=svg_to_video_db

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run Locally
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Cloud Deployment Options

### Option A: Render.com (Free & Easiest)
Render uses the preconfigured **`Dockerfile`** in the repository to automatically install Chromium, FFmpeg, and fonts.
1. Sign up on [Render.com](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Select **`Docker`** as the **Runtime**.
4. Select the **`Free`** tier.
5. In **Advanced**, add all your `.env` variables.
6. Click **Create Web Service**.

### Option B: Hugging Face Spaces (Free & High RAM)
Hugging Face offers 16GB RAM for free, which handles 4K rendering smoothly.
1. Create a **New Space** on Hugging Face.
2. Select **`Docker`** as the SDK and choose **`Blank`** template.
3. Link your billing card in Hugging Face settings to unlock Docker Spaces (it remains $0/month free tier).
4. Add your `.env` variables under **Settings > Variables and secrets**.
5. Push the code to the Hugging Face Git remote:
   ```bash
   git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
   git push hf main --force
   ```

### Option C: Ubuntu VPS (Hetzner / DigitalOcean)
For dedicated performance, deploy on a Linux VPS:
1. SSH into the VPS and install system dependencies:
   ```bash
   sudo apt update
   sudo apt install -y ffmpeg chromium-browser nodejs pnpm
   npm install -g pm2
   ```
2. Clone repository, run `pnpm install`, and `pnpm run build`.
3. Create `ecosystem.config.js` and start the server with:
   ```bash
   pm2 start ecosystem.config.js
   ```

---

## 📝 License
This project is licensed under the [MIT License](LICENSE).
