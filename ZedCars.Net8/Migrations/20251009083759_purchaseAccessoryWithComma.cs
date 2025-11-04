using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZedCars.Net8.Migrations
{
    /// <inheritdoc />
    public partial class purchaseAccessoryWithComma : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessoryName",
                table: "AccessoryPurchases");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "AccessoryPurchases");

            migrationBuilder.AddColumn<string>(
                name: "SelectedAccessoriesString",
                table: "Purchases",
                type: "varchar(1000)",
                maxLength: 1000,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SelectedAccessoriesString",
                table: "AccessoryPurchases",
                type: "varchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SelectedAccessoriesString",
                table: "Purchases");

            migrationBuilder.DropColumn(
                name: "SelectedAccessoriesString",
                table: "AccessoryPurchases");

            migrationBuilder.AddColumn<string>(
                name: "AccessoryName",
                table: "AccessoryPurchases",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "AccessoryPurchases",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
