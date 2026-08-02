[CmdletBinding()]
param(
  [switch]$Force,
  [switch]$NoCluster
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$codeGraphDir = Join-Path $repoRoot "graphify-out\code"
$previousGraphifyOut = $env:GRAPHIFY_OUT
$locationPushed = $false

try {
  $graphifyCommand = Get-Command graphify -ErrorAction Stop
  $env:GRAPHIFY_OUT = $codeGraphDir

  Push-Location $repoRoot
  $locationPushed = $true

  $graphifyArgs = @("extract", ".", "--code-only")
  if ($Force) {
    $graphifyArgs += "--force"
  }
  if ($NoCluster) {
    $graphifyArgs += "--no-cluster"
  }

  & $graphifyCommand.Source @graphifyArgs
  if ($LASTEXITCODE -ne 0) {
    throw "Graphify code update failed with exit code $LASTEXITCODE."
  }
}
finally {
  if ($locationPushed) {
    Pop-Location
  }

  if ($null -eq $previousGraphifyOut) {
    Remove-Item Env:GRAPHIFY_OUT -ErrorAction SilentlyContinue
  }
  else {
    $env:GRAPHIFY_OUT = $previousGraphifyOut
  }
}
