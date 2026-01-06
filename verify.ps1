# verify.ps1 - Verify complete setup

Write-Host "🔍 Verifying SAT Blog Setup..." -ForegroundColor Yellow

# 1. Check local database
Write-Host "`n1. Local Database:" -ForegroundColor Cyan
npx wrangler d1 execute sat-blog-db --command="SELECT COUNT(*) as blog_count FROM blogs;" --local

# 2. Check local API
Write-Host "`n2. Local API:" -ForegroundColor Cyan
$localHealth = Invoke-RestMethod -Uri "http://localhost:8787/api/health" -Method Get -ErrorAction SilentlyContinue
if ($localHealth) {
    Write-Host "   ✅ Local API: $($localHealth.message)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Local API not running" -ForegroundColor Red
}

# 3. Check React app (assuming it's on port 3000)
Write-Host "`n3. React App:" -ForegroundColor Cyan
$reactTest = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -ErrorAction SilentlyContinue
if ($reactTest) {
    Write-Host "   ✅ React app is running on port 3000" -ForegroundColor Green
} else {
    Write-Host "   ❌ React app not running" -ForegroundColor Red
}

# 4. Check if we can create a test blog
Write-Host "`n4. Test Blog Creation:" -ForegroundColor Cyan
$testBlog = @{
    title = "Verification Test Blog"
    slug = "verification-test-blog"
    category = "SAT Tips"
    author = "Verification Script"
    html_content = "<p>This is a verification test.</p>"
    status = "published"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:8787/api/blogs" -Method Post -ContentType "application/json" -Body $testBlog
    Write-Host "   ✅ Blog creation test passed!" -ForegroundColor Green
    Write-Host "   📝 Blog ID: $($result.id)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Blog creation failed: $_" -ForegroundColor Red
}

Write-Host "`n📊 Final Database Status:" -ForegroundColor Yellow
npx wrangler d1 execute sat-blog-db --command="SELECT id, title, slug, status, created_at FROM blogs ORDER BY created_at DESC LIMIT 5;" --local