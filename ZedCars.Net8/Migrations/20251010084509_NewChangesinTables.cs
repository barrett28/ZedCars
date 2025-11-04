using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZedCars.Net8.Migrations
{
    /// <inheritdoc />
    public partial class NewChangesinTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_AccessoryPurchaseOnly_Accessories_AccessoryId",
            //    table: "AccessoryPurchaseOnly");

            //migrationBuilder.DropIndex(
            //    name: "IX_AccessoryPurchaseOnly_AccessoryId",
            //    table: "AccessoryPurchaseOnly");

            //migrationBuilder.DropColumn(
            //    name: "AccessoryId",
            //    table: "AccessoryPurchaseOnly");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AccessoryId",
                table: "AccessoryPurchaseOnly",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AccessoryPurchaseOnly_AccessoryId",
                table: "AccessoryPurchaseOnly",
                column: "AccessoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_AccessoryPurchaseOnly_Accessories_AccessoryId",
                table: "AccessoryPurchaseOnly",
                column: "AccessoryId",
                principalTable: "Accessories",
                principalColumn: "AccessoryId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
