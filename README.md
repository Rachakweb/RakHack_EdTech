# RakHack EdTech Platform 🔒
*An interactive environment for ethical hacking and reverse engineering.*

🚨 **IMPORTANT: DEVELOPMENT PHASE** 🚨
> This project is currently in the active development phase. Features may be unstable, and learning modules are continuously being added or restructured.

## Complete Ecosystem Dockerization 🐳
You can now spin up the entire frontend platform and all corresponding vulnerable lab backends instantly using Docker Compose!

**Quick Start:**
1. Ensure Docker Desktop is running.
2. In the root directory, run:
   ```bash
   docker-compose up --build -d
   ```
3. Navigate to **http://localhost:8080** in your browser. The vulnerable SQLi infrastructure automatically binds to port 4000 in the background.

---

## Contributor Guide: Adding New Courses 📚
We welcome new modules! The platform utilizes a strictly modular dictionary pattern so you can add your content **without breaking the existing curriculum**.

**How to safely add your module:**
1. Do **not** touch other course objects. Open `platform/src/App.tsx`.
2. Locate the `coursesData` dictionary. 
3. Add a new key for your course (e.g., `'net': { title: 'Network Exploitation', identifier: 'CL-NET', modules: [...] }`).
4. Add your corresponding `.md` interactive guide files into `platform/public/`. 
5. Tag your module with `hasLab: true` to natively render a deploy button, or `flag: "RakHack{...}"` to render an automated assessment flag submission terminal!

---

## Pull Request Instructions 🔄
If you are collaborating on this project:
1. **Fork** the repository and create your feature branch: `git checkout -b feature/my-new-course`
2. Validate that the React frontend builds successfully locally using `npm run build` in the `/platform` folder.
3. Ensure absolutely no local secrets, `.env` files, or raw `node_modules` caches are committed.
4. **Push** your branch and submit a PR to `main`. 
5. In your PR description, explain the *core vulnerability* your new module teaches!
