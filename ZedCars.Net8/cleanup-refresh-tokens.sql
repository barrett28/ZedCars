-- Step 1: Check current token count per user
SELECT AdminId, COUNT(*) AS TokenCount
FROM RefreshTokens
GROUP BY AdminId
ORDER BY TokenCount DESC;

-- Step 2: Clean up duplicate refresh tokens, keeping only the latest token per user
DELETE t1
FROM RefreshTokens t1
INNER JOIN (
    SELECT AdminId, MAX(Id) AS MaxId
    FROM RefreshTokens
    GROUP BY AdminId
) t2 ON t1.AdminId = t2.AdminId
WHERE t1.Id < t2.MaxId;

-- Step 3: Verify cleanup - should return no results
SELECT AdminId, COUNT(*) AS TokenCount
FROM RefreshTokens
GROUP BY AdminId
HAVING COUNT(*) > 1;

-- Step 4: Show remaining tokens summary
SELECT 
    COUNT(*) AS TotalTokens,
    COUNT(DISTINCT AdminId) AS UniqueUsers
FROM RefreshTokens;
