#!/bin/bash

echo "Setting up accessory purchase tables..."
echo "======================================="

# Check if MySQL is available
if command -v mysql &> /dev/null; then
    echo "MySQL client found. Running database sync..."
    mysql -u zoomcars_user -padmin123 zoomcars_inventory < sync-database.sql
    echo "Database sync completed!"
else
    echo "MySQL client not found. Please run the following SQL script manually:"
    echo "File: sync-database.sql"
    echo ""
    echo "You can also use phpMyAdmin, MySQL Workbench, or any other MySQL client."
fi

echo ""
echo "After running the SQL script, try running your application:"
echo "dotnet run"
echo ""
echo "If you still get migration errors, you can skip migrations by commenting out"
echo "the database update code in Program.cs or use:"
echo "dotnet ef database update --no-build"
