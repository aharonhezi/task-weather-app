# Comprehensive API Test Script for Todo App
# Run: .\api-tests.ps1

$baseUrl = "http://localhost:5000/api"
$results = @()

function Test-Passed {
    param($testName, $details = "")
    Write-Host "✅ $testName - PASSED" -ForegroundColor Green
    if ($details) { Write-Host "   $details" -ForegroundColor Gray }
    $script:results += @{Test=$testName; Status="PASS"; Details=$details}
}

function Test-Failed {
    param($testName, $error)
    Write-Host "❌ $testName - FAILED" -ForegroundColor Red
    Write-Host "   Error: $error" -ForegroundColor Red
    $script:results += @{Test=$testName; Status="FAIL"; Details=$error}
}

Write-Host "`n=== Starting API Tests ===" -ForegroundColor Cyan

# Test 1: Register User
try {
    $body = @{email="apitest@example.com";username="apitest";password="password123"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType "application/json"
    $token = $response.data.token
    $userId = $response.data.user.id
    Test-Passed "TC-AUTH-001: User Registration" "User ID: $userId"
} catch {
    Test-Failed "TC-AUTH-001: User Registration" $_.Exception.Message
    exit
}

$headers = @{Authorization="Bearer $token"}

# Test 2: Login
try {
    $body = @{email="apitest@example.com";password="password123"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType "application/json"
    Test-Passed "TC-AUTH-005: User Login" "Token received"
} catch {
    Test-Failed "TC-AUTH-005: User Login" $_.Exception.Message
}

# Test 3: Create Basic Task
try {
    $body = @{title="API Test Task 1"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/tasks" -Method POST -Body $body -ContentType "application/json" -Headers $headers
    $taskId1 = $response.data.id
    Test-Passed "TC-TASK-001: Create Basic Task" "Task ID: $taskId1"
} catch {
    Test-Failed "TC-TASK-001: Create Basic Task" $_.Exception.Message
}

# Test 4: Create Task with All Fields
try {
    $body = @{
        title="Complete Task"
        description="Full description"
        dueDate="2024-12-29T00:00:00Z"
        tag="High"
        note="Important note"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/tasks" -Method POST -Body $body -ContentType "application/json" -Headers $headers
    $taskId2 = $response.data.id
    Test-Passed "TC-TASK-002: Create Task with All Fields" "Task ID: $taskId2"
} catch {
    Test-Failed "TC-TASK-002: Create Task with All Fields" $_.Exception.Message
}

# Test 5: Create Task with City (Weather)
try {
    $body = @{title="Visit Paris for vacation"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/tasks" -Method POST -Body $body -ContentType "application/json" -Headers $headers
    Start-Sleep -Seconds 3
    $weatherCity = $response.data.weatherCity
    Test-Passed "TC-TASK-003: Weather API Integration" "City: $weatherCity"
} catch {
    Test-Failed "TC-TASK-003: Weather API Integration" $_.Exception.Message
}

# Test 6: Edit Task
try {
    $body = @{title="Updated Task Title"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/tasks/$taskId1" -Method PUT -Body $body -ContentType "application/json" -Headers $headers
    Test-Passed "TC-TASK-009: Edit Task" "Title updated"
} catch {
    Test-Failed "TC-TASK-009: Edit Task" $_.Exception.Message
}

# Test 7: Toggle Task
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tasks/$taskId1/toggle" -Method PATCH -Headers $headers
    Test-Passed "TC-TASK-017: Mark Task as Done" "Completed: $($response.data.isCompleted)"
} catch {
    Test-Failed "TC-TASK-017: Mark Task as Done" $_.Exception.Message
}

# Test 8: Search Tasks
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tasks?search=Complete" -Method GET -Headers $headers
    Test-Passed "TC-SEARCH-001: Search by Title" "Found: $($response.data.Count) tasks"
} catch {
    Test-Failed "TC-SEARCH-001: Search by Title" $_.Exception.Message
}

# Test 9: Get All Tasks
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tasks" -Method GET -Headers $headers
    Test-Passed "Get All Tasks" "Total: $($response.data.Count) tasks"
} catch {
    Test-Failed "Get All Tasks" $_.Exception.Message
}

# Test 10: Protected Route (No Auth)
try {
    Invoke-RestMethod -Uri "$baseUrl/tasks" -Method GET -ErrorAction Stop | Out-Null
    Test-Failed "TC-AUTH-009: Protected Route" "Should require authentication"
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Test-Passed "TC-AUTH-009: Protected Route" "401 Unauthorized as expected"
    } else {
        Test-Failed "TC-AUTH-009: Protected Route" "Wrong error code"
    }
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
$passed = ($results | Where-Object {$_.Status -eq "PASS"}).Count
$failed = ($results | Where-Object {$_.Status -eq "FAIL"}).Count
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "Total: $($results.Count)" -ForegroundColor White

$results | Format-Table -AutoSize



