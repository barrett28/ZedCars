#!/bin/bash

# Script to fix migration issues
echo "Fixing Entity Framework migrations..."

# Remove the latest problematic migrations
echo "Removing problematic migrations..."
rm -f Migrations/20251010084500_FixExistingTables.cs
rm -f Migrations/20251010084509_NewChangesinTables.cs
rm -f Migrations/20251010084509_NewChangesinTables.Designer.cs
rm -f Migrations/20251010085100_CreateMissingTables.cs

# Try to create a new migration
echo "Creating new migration..."
dotnet ef migrations add FixAccessoryTables --no-build

echo "Migration fix complete!"
echo ""
echo "To apply the migration to your database, run:"
echo "dotnet ef database update"
echo ""
echo "Or manually run the SQL scripts:"
echo "1. 04-add-accessory-purchase-tables.sql"
echo "2. 05-fix-all-tables.sql"
