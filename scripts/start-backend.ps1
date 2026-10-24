$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $repoRoot "backend"
$venvPython = Join-Path $backendDir ".venv\Scripts\python.exe"
$requirements = Join-Path $backendDir "requirements.txt"
$installMarker = Join-Path $backendDir ".venv\.queuecare-dependencies-installed"

Set-Location $backendDir

if (-not (Test-Path $venvPython)) {
    Write-Output "Creating QueueCare backend virtual environment..."
    py -3.11 -m venv .venv
    if ($LASTEXITCODE -ne 0) {
        throw "Could not create the backend virtual environment. Install Python 3.11 and the Python launcher, then reopen VS Code."
    }
}

$installDependencies = -not (Test-Path $installMarker)
if (-not $installDependencies) {
    $installDependencies = (Get-Item $requirements).LastWriteTimeUtc -gt (Get-Item $installMarker).LastWriteTimeUtc
}

if ($installDependencies) {
    Write-Output "Installing QueueCare backend dependencies (first launch or requirements changed)..."
    & $venvPython -m pip install -r $requirements
    if ($LASTEXITCODE -ne 0) {
        throw "Backend dependency installation failed. Check your network connection and backend/requirements.txt."
    }
    New-Item -ItemType File -Force $installMarker | Out-Null
}

Write-Output "Starting QueueCare backend on http://127.0.0.1:8000 ..."
& $venvPython -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
