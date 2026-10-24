$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$frontendDir = Join-Path $repoRoot "frontend"
$nodeModules = Join-Path $frontendDir "node_modules"
Set-Location $frontendDir

if (-not (Test-Path $nodeModules)) {
    Write-Output "Installing QueueCare frontend dependencies..."
    npm.cmd ci
    if ($LASTEXITCODE -ne 0) {
        throw "Frontend dependency installation failed. Check your network connection and frontend/package-lock.json."
    }
}

Write-Output "Starting QueueCare frontend..."
npm.cmd run dev -- --host 127.0.0.1
