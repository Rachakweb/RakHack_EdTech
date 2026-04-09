import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'child_process'
import path from 'path'

// Vite plugin to run the SQL lab backend
function sqliLabRunner() {
  let sqliProcess: any = null;
  return {
    name: 'sqli-lab-runner',
    configureServer(server: any) {
      server.middlewares.use('/api/start-sqli-lab', (_req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        if (sqliProcess) {
          res.end(JSON.stringify({ status: 'running', port: 4000 }));
          return;
        }
        
        const labDir = path.resolve(__dirname, '../labs/sqli');
        sqliProcess = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['start'], {
          cwd: labDir,
          shell: true,
          stdio: 'ignore'
        });

        sqliProcess.on('exit', () => { sqliProcess = null; });
        sqliProcess.on('error', () => { sqliProcess = null; });
        
        res.end(JSON.stringify({ status: 'started', port: 4000 }));
      });
      
      server.middlewares.use('/api/status-sqli-lab', (_req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: sqliProcess ? 'running' : 'stopped', port: 4000 }));
      });

      server.middlewares.use('/api/stop-sqli-lab', (_req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        if (sqliProcess) {
          if (/^win/.test(process.platform)) {
            spawn('taskkill', ['/pid', String(sqliProcess.pid), '/f', '/t']);
          } else {
            sqliProcess.kill('SIGTERM');
          }
          sqliProcess = null;
        }
        res.end(JSON.stringify({ status: 'stopped', port: 4000 }));
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sqliLabRunner()],
})
