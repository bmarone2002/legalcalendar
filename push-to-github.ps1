# Script per caricare il progetto Legal Calendar su GitHub
# Repository: https://github.com/bmarone2002/legalcalendar
# Uso: .\push-to-github.ps1   (oppure con -RepoUrl "..." per un altro repo)

param(
    [string]$RepoUrl = "https://github.com/bmarone2002/legalcalendar.git"
)

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

# Cerca git nel PATH o in percorsi comuni
$gitExe = $null
if (Get-Command git -ErrorAction SilentlyContinue) { $gitExe = "git" }
else {
    $paths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe"
    )
    foreach ($p in $paths) {
        if (Test-Path $p) { $gitExe = $p; break }
    }
}

if (-not $gitExe) {
    Write-Host "Git non trovato. Installa Git da https://git-scm.com/download/win e riprova." -ForegroundColor Red
    exit 1
}

function Run-Git { & $gitExe @args }

Set-Location $projectRoot

# Inizializza repo se non esiste
if (-not (Test-Path ".git")) {
    Write-Host "Inizializzazione repository Git..." -ForegroundColor Cyan
    Run-Git init
}

# Remote: chiedi URL se non passato
if (-not $RepoUrl) {
    $RepoUrl = Read-Host "Incolla l'URL del repository GitHub (es. https://github.com/tuousername/legal-calendar.git)"
}
$RepoUrl = $RepoUrl.Trim()
if (-not $RepoUrl) {
    Write-Host "URL mancante. Crea un nuovo repository su https://github.com/new (lascialo vuoto, senza README) e usa il suo URL." -ForegroundColor Yellow
    exit 1
}

# Imposta remote origin (sostituisce se esiste)
Run-Git remote remove origin 2>$null
Run-Git remote add origin $RepoUrl

# Aggiungi tutti i file e commit
Run-Git add -A
$status = Run-Git status --porcelain
if ($status) {
    Run-Git commit -m "Initial commit: Legal Calendar app"
    Write-Host "Commit creato." -ForegroundColor Green
} else {
    Write-Host "Nessuna modifica da committare (già tutto committato)." -ForegroundColor Yellow
}

# Push (branch main o master)
$branch = "main"
Run-Git branch -M $branch
Write-Host "Caricamento su GitHub (branch $branch)..." -ForegroundColor Cyan
Run-Git push -u origin $branch

Write-Host "Fatto. Repository disponibile su GitHub." -ForegroundColor Green
