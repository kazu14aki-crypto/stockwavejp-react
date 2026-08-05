$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $repo "frontend"

function Replace-Text([string]$path, [string]$old, [string]$new) {
  if (-not (Test-Path $path)) { throw "File not found: $path" }
  $text = Get-Content -Raw -Encoding UTF8 $path
  if ($text.Contains($old)) {
    $text = $text.Replace($old, $new)
    Set-Content -Path $path -Value $text -Encoding UTF8
    Write-Host "Fixed: $path"
  } else {
    Write-Host "No matching faulty text found (already fixed or different revision): $path"
  }
}

# Theme list: displayReturn was referenced inside CustomThemeRow although only pct exists there.
$themeList = Join-Path $frontend "src\components\pages\ThemeList.jsx"
Replace-Text $themeList 'Math.abs(displayReturn)/25*100' 'Math.abs(pct)/25*100'

# Market detail: ensure the subscription hook is imported and initialized before canAccessPeriod is used.
$marketRank = Join-Path $frontend "src\components\pages\MarketRank.jsx"
$text = Get-Content -Raw -Encoding UTF8 $marketRank
if ($text -match 'canAccessPeriod' -and $text -notmatch 'const\s*\{[^}]*canAccessPeriod[^}]*\}\s*=\s*useSubscription\(\)') {
  if ($text -notmatch "useSubscription") {
    $text = $text -replace "(import[^\r\n]+\r?\n)", "`$1import { useSubscription } from '../../hooks/useSubscription.jsx'`r`n", 1
  }
  $needle = 'export default function MarketRank({ onNavigate, isMobile } = {}) {'
  if ($text.Contains($needle)) {
    $text = $text.Replace($needle, $needle + "`r`n  const { canAccessPeriod } = useSubscription()")
    Set-Content -Path $marketRank -Value $text -Encoding UTF8
    Write-Host "Fixed subscription access in MarketRank.jsx"
  } else {
    throw "Could not locate MarketRank component declaration."
  }
} else {
  Write-Host "MarketRank subscription access is already defined or not used."
}

Write-Host "JP runtime repairs completed."
