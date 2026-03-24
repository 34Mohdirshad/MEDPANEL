# ⚕️ Medical Portal - Master Startup Script

Write-Output "--- 🏥 CLINICAL REPOSITORY SYSTEM STARTUP ---"

# Start Backend
Write-Output "Starting Backend API in MOCK MODE (Zero Setup)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev:mock"

# Start Frontend
Write-Output "Starting Frontend Portal on Port 3000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Output "------------------------------------------------"
Write-Output "✅ Systems Initialized!"
Write-Output "👉 Backend: http://localhost:5000"
Write-Output "👉 Frontend: http://localhost:3000"
Write-Output "------------------------------------------------"
Write-Output "⚠️ IMPORTANT: Ensure server/.env is populated with MongoDB/Cloudinary keys before use."
