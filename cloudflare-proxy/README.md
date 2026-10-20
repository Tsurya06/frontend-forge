# Cloudflare Worker AI Proxy for FrontendForge

This 100% free serverless proxy hides your **NVIDIA Nemotron Ultra API Key** (or Google Gemini/Groq keys) so visitors to FrontendForge on GitHub Pages can stream AI without ever seeing your key.

- **Cost:** Free forever (Cloudflare provides 100,000 free requests every day).
- **Setup Time:** ~2 minutes.
- **Browser Independent:** Works in Brave, Chrome, Safari, Firefox, iOS, and Android.

---

## 2-Minute Deployment Steps

### 1. Create a Free Worker
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and log in (or sign up for free).
2. Click **Compute (Workers & Pages)** in the left sidebar -> **Workers**.
3. Click **Create Worker**.
4. Give it a name like `feeq-ai-proxy` and click **Deploy**.

### 2. Paste the Worker Code
1. Click **Edit code**.
2. Replace all existing code with the contents of [`worker.js`](./worker.js).
3. Click **Deploy**.

### 3. Add Your Encrypted NVIDIA Secret Key
1. Go back to the Worker's dashboard.
2. Click **Settings** -> **Variables and Secrets**.
3. Under **Secrets**, click **Add**:
   - **Variable name:** `NVIDIA_API_KEY`
   - **Value:** Paste your NVIDIA NIM API key (`nvapi-...`).
   - Click **Save and Deploy**.

### 4. Connect to FrontendForge
1. Copy your Worker URL (e.g. `https://feeq-ai-proxy.yourname.workers.dev`).
2. Open FrontendForge (`⌘J` -> **⚙️ Settings**):
   - Select **Zero-Config Edge Proxy**.
   - Paste `https://feeq-ai-proxy.yourname.workers.dev` in **Edge Proxy URL**.
   - Click **Save Settings**.
3. Alternatively, you can add it to `.env`:
   ```bash
   VITE_AI_PROXY_URL=https://feeq-ai-proxy.yourname.workers.dev
   ```
   Now **every single user** on your deployed site gets free AI streaming, and your API key remains 100% hidden and secure!
