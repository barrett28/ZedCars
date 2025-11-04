using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZedCars.Net8.Migrations
{
    /// <inheritdoc />
    public partial class CreateMissingTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AccessoryPurchaseOnly",
                columns: table => new
                {
                    AccessoryPurchaseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", "IdentityColumn"),
                    BuyerName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    BuyerEmail = table.Column<string>(type: "longtext", nullable: false),
                    SelectedAccessoriesString = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PurchaseDate = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessoryPurchaseOnly", x => x.AccessoryPurchaseId);
                });

            migrationBuilder.CreateTable(
                name: "PurchaseAccessoryWithCar",
                columns: table => new
                {
                    PurchaseAccessoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", "IdentityColumn"),
                    PurchaseId = table.Column<int>(type: "int", nullable: false),
                    AccessoryName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseAccessoryWithCar", x => x.PurchaseAccessoryId);
                    table.ForeignKey(
                        name: "FK_PurchaseAccessoryWithCar_Purchases_PurchaseId",
                        column: x => x.PurchaseId,
                        principalTable: "Purchases",
                        principalColumn: "PurchaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseAccessoryWithCar_PurchaseId",
                table: "PurchaseAccessoryWithCar",
                column: "PurchaseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "AccessoryPurchaseOnly");
            migrationBuilder.DropTable(name: "PurchaseAccessoryWithCar");
        }
    }
}
