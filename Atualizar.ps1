param([switch]$Apk)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (!(Test-Path '.git')) { throw 'Esta pasta precisa ser clonada do GitHub primeiro. Veja o README.' }
$changes = git status --porcelain
if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel consultar o Git.' }
if ($changes) { throw 'Ha alteracoes locais. Salve-as em um commit antes de atualizar; nada foi sobrescrito.' }
git pull --ff-only
if ($LASTEXITCODE -ne 0) { throw 'A atualizacao pelo Git falhou.' }
npm ci
if ($LASTEXITCODE -ne 0) { throw 'Falha ao instalar dependencias.' }
# As rotas geradas pertencem ao checkout anterior. O Expo as recria ao iniciar.
$routerTypes = Join-Path $PSScriptRoot '.expo\types\router.d.ts'
if (Test-Path -LiteralPath $routerTypes) {
    Remove-Item -LiteralPath $routerTypes -Force
}
npm run typecheck
if ($LASTEXITCODE -ne 0) { throw 'A verificacao encontrou erros.' }
if ($Apk) {
    npx --yes eas-cli build --platform android --profile preview
    if ($LASTEXITCODE -ne 0) { throw 'O build do APK nao foi concluido. Copie o link e o erro do EAS.' }
} else {
    node .\node_modules\expo\bin\cli start --dev-client --tunnel --clear
}
