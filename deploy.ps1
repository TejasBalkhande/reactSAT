# deploy.ps1 - Deployment script for SAT Blog

Write-Host "🚀 Deploying SAT Blog to Cloudflare..." -ForegroundColor Yellow

# Step 1: Build React app
Write-Host "`n1. Building React app..." -ForegroundColor Cyan
npm run build

# Step 2: Deploy Worker
Write-Host "`n2. Deploying Cloudflare Worker..." -ForegroundColor Cyan
npx wrangler deploy

# Step 3: Initialize production database
Write-Host "`n3. Setting up production database..." -ForegroundColor Cyan
npx wrangler d1 execute sat-blog-db --file=schema.sql --remote

# Step 4: Test production
Write-Host "`n4. Testing production API..." -ForegroundColor Cyan
$workerUrl = "https://sat-blog-worker.your-username.workers.dev"
try {
    $health = Invoke-RestMethod -Uri "$workerUrl/api/health" -Method Get
    Write-Host "   ✅ Production API is healthy!" -ForegroundColor Green
    Write-Host "   📊 Database: $($health.database)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Production API test failed: $_" -ForegroundColor Red
}

# Step 5: Show deployment info
Write-Host "`n📋 Deployment Summary:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000 (development)" -ForegroundColor Cyan
Write-Host "   API: $workerUrl" -ForegroundColor Cyan
Write-Host "   Database: Cloudflare D1 (sat-blog-db)" -ForegroundColor Cyan
Write-Host "   Schema: blogs table with indexes" -ForegroundColor Cyan

Write-Host "`n🎉 Deployment complete! Your blogs are now saved to Cloudflare D1." -ForegroundColor Green