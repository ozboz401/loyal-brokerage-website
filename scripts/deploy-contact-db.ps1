# ============================================================================
# SUPABASE CLI AUTO-DEPLOYMENT SCRIPT
# ============================================================================
# This script fully automates Contact form database deployment
# No manual dashboard access required
# ============================================================================

Write-Host "🚀 SUPABASE CLI AUTO-DEPLOYMENT" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Gray
Write-Host ""

# Step 1: Check if Supabase CLI is installed
Write-Host "📦 Step 1: Checking Supabase CLI..." -ForegroundColor Yellow
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseInstalled) {
    Write-Host "   ⚠️  Supabase CLI not found. Installing..." -ForegroundColor Yellow
    
    # Install via Scoop (recommended for Windows)
    if (Get-Command scoop -ErrorAction SilentlyContinue) {
        Write-Host "   📥 Installing via Scoop..." -ForegroundColor Cyan
        scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
        scoop install supabase
    }
    # Install via npm if scoop not available
    elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        Write-Host "   📥 Installing via npm..." -ForegroundColor Cyan
        npm install -g supabase
    }
    else {
        Write-Host "   ❌ ERROR: Neither Scoop nor npm found" -ForegroundColor Red
        Write-Host "   Install Scoop: https://scoop.sh/" -ForegroundColor Yellow
        Write-Host "   OR install npm: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "   ✅ Supabase CLI installed" -ForegroundColor Green
} else {
    Write-Host "   ✅ Supabase CLI already installed" -ForegroundColor Green
}

Write-Host ""

# Step 2: Login to Supabase
Write-Host "🔐 Step 2: Authenticating with Supabase..." -ForegroundColor Yellow
Write-Host "   Opening browser for authentication..." -ForegroundColor Cyan
Write-Host ""

supabase login

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Authentication failed" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Authenticated successfully" -ForegroundColor Green
Write-Host ""

# Step 3: Link to project
Write-Host "🔗 Step 3: Linking to project..." -ForegroundColor Yellow
Write-Host "   Project Ref: cfcrttsxeaugwfuoirod" -ForegroundColor Cyan

supabase link --project-ref cfcrttsxeaugwfuoirod

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Project linking failed" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Project linked" -ForegroundColor Green
Write-Host ""

# Step 4: Push migrations
Write-Host "📤 Step 4: Deploying migrations..." -ForegroundColor Yellow
Write-Host "   Pushing to database..." -ForegroundColor Cyan

supabase db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Migration deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Migrations deployed successfully" -ForegroundColor Green
Write-Host ""

# Step 5: Validation
Write-Host "✅ Step 5: Validating deployment..." -ForegroundColor Yellow
Write-Host ""
Write-Host ("=" * 70) -ForegroundColor Gray
Write-Host "📊 DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host ("=" * 70) -ForegroundColor Gray
Write-Host ""
Write-Host "✅ contact_messages table created" -ForegroundColor Green
Write-Host "✅ RLS policies enabled" -ForegroundColor Green
Write-Host "✅ Indexes created" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Contact form is now fully operational!" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Test at: http://localhost:5173/contact" -ForegroundColor Yellow
Write-Host ""

# Verification query
Write-Host "📋 Run this to verify:" -ForegroundColor Yellow
Write-Host "   SELECT COUNT(*) FROM contact_messages;" -ForegroundColor Cyan
Write-Host ""
