#!/bin/bash

echo "Setting up ZedCars MySQL Database..."

# Database connection details
DB_HOST="localhost"
DB_NAME="zoomcars_inventory"
DB_USER="zoomcars_user"
DB_PASS="admin123"

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "MySQL is not installed or not in PATH"
    exit 1
fi

# Test connection
echo "Testing MySQL connection..."
mysql -h$DB_HOST -u$DB_USER -p$DB_PASS -e "SELECT 1;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ MySQL connection successful"
    
    # Check if database exists
    mysql -h$DB_HOST -u$DB_USER -p$DB_PASS -e "USE $DB_NAME;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Database '$DB_NAME' exists"
        
        # Check if tables exist
        TABLE_COUNT=$(mysql -h$DB_HOST -u$DB_USER -p$DB_PASS -D$DB_NAME -e "SHOW TABLES;" 2>/dev/null | wc -l)
        if [ $TABLE_COUNT -gt 1 ]; then
            echo "✅ Database tables exist ($((TABLE_COUNT-1)) tables found)"
            echo "🎉 Database is ready! You can now run the application."
        else
            echo "❌ Database exists but no tables found"
            echo "Run the original SQL scripts to create tables and data"
        fi
    else
        echo "❌ Database '$DB_NAME' does not exist"
        echo "Please create the database and run the SQL scripts first"
    fi
else
    echo "❌ Cannot connect to MySQL"
    echo "Please check MySQL is running and credentials are correct"
fi

echo ""
echo "To set up the database manually:"
echo "1. mysql -u root -p"
echo "2. CREATE DATABASE zoomcars_inventory;"
echo "3. CREATE USER 'zoomcars_user'@'localhost' IDENTIFIED BY 'admin123';"
echo "4. GRANT ALL PRIVILEGES ON zoomcars_inventory.* TO 'zoomcars_user'@'localhost';"
echo "5. Run the SQL files from the original project"
