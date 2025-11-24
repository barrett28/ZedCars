using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZedCars.Net8.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConstraintforRefreshToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Clean up duplicate tokens first
            migrationBuilder.Sql(@"
                DELETE t1 FROM RefreshTokens t1
                INNER JOIN (
                    SELECT AdminId, MAX(Id) as MaxId
                    FROM RefreshTokens
                    GROUP BY AdminId
                ) t2 ON t1.AdminId = t2.AdminId
                WHERE t1.Id < t2.MaxId;
            ");

            // Drop foreign key
            migrationBuilder.DropForeignKey(
                name: "FK_RefreshTokens_Admins_AdminId",
                table: "RefreshTokens");

            // Drop existing index
            migrationBuilder.DropIndex(
                name: "IX_RefreshTokens_AdminId",
                table: "RefreshTokens");

            // Create unique index
            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_AdminId",
                table: "RefreshTokens",
                column: "AdminId",
                unique: true);

            // Recreate foreign key
            migrationBuilder.AddForeignKey(
                name: "FK_RefreshTokens_Admins_AdminId",
                table: "RefreshTokens",
                column: "AdminId",
                principalTable: "Admins",
                principalColumn: "AdminId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RefreshTokens_Admins_AdminId",
                table: "RefreshTokens");

            migrationBuilder.DropIndex(
                name: "IX_RefreshTokens_AdminId",
                table: "RefreshTokens");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_AdminId",
                table: "RefreshTokens",
                column: "AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_RefreshTokens_Admins_AdminId",
                table: "RefreshTokens",
                column: "AdminId",
                principalTable: "Admins",
                principalColumn: "AdminId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}



