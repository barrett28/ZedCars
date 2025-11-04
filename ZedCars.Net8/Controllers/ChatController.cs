using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace ZedCars.Net8.Controllers
{
    public class ChatController : Controller
    {
        public class ChatRequest
        {
            public string? Message { get; set; }
        }

        public class ChatButton
        {
            public string? Label { get; set; }
            public string? Action { get; set; }
        }

        public class ChatResponse
        {
            public string? Message { get; set; }
            public List<ChatButton>? Buttons { get; set; }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Ask([FromBody] ChatRequest request)
        {
            var text = (request?.Message ?? "").Trim().ToLower();
            var resp = new ChatResponse { Buttons = new List<ChatButton>() };

            if (string.IsNullOrWhiteSpace(text))
            {
                resp.Message = "Hi — I can help you navigate the site. Try one of the quick actions below.";
                resp.Buttons.AddRange(new[]
                {
                    new ChatButton { Label = "Inventory", Action = "/Car/Inventory" },
                    new ChatButton { Label = "Accessories", Action = "/Accessory/Index" },
                    new ChatButton { Label = "Create Vehicle", Action = "/Car/Create" },
                    new ChatButton { Label = "Home", Action = "/Home/Index" }
                });
                return Json(resp);
            }

            // Keyword matching (extend as needed)
            if (text.Contains("inventory") || text.Contains("vehicles") || text.Contains("cars"))
            {
                resp.Message = "You can browse all vehicles in Inventory or add a new one.";
                resp.Buttons.Add(new ChatButton { Label = "View Inventory", Action = "/Car/Inventory" });
                resp.Buttons.Add(new ChatButton { Label = "Create Vehicle", Action = "/Car/Create" });
                return Json(resp);
            }

            if (text.Contains("accessory") || text.Contains("accessories") || text.Contains("parts"))
            {
                resp.Message = "Manage accessories here.";
                resp.Buttons.Add(new ChatButton { Label = "Accessories", Action = "/Accessory/Index" });
                return Json(resp);
            }

            if (text.Contains("create") || text.Contains("add vehicle") || text.Contains("add car"))
            {
                resp.Message = "Use the create form to add a new vehicle.";
                resp.Buttons.Add(new ChatButton { Label = "Create Vehicle", Action = "/Car/Create" });
                return Json(resp);
            }

            if (text.Contains("home") || text.Contains("main"))
            {
                resp.Message = "Go back to the Home page.";
                resp.Buttons.Add(new ChatButton { Label = "Home", Action = "/Home/Index" });
                return Json(resp);
            }

            if (text.Contains("about") || text.Contains("company") || text.Contains("overview"))
            {
                resp.Message = "ZedCars is a demo car inventory manager — manage vehicles, accessories and stock.";
                resp.Buttons.Add(new ChatButton { Label = "About Us", Action = "/Home/About" });
                return Json(resp);
            }

            if (text.Contains("help") || text.Contains("commands"))
            {
                resp.Message = "Try: Inventory, Accessories, Create Vehicle, Home, About.";
                resp.Buttons.Add(new ChatButton { Label = "Inventory", Action = "/Car/Inventory" });
                resp.Buttons.Add(new ChatButton { Label = "Accessories", Action = "/Accessory/Index" });
                return Json(resp);
            }

            // fallback
            resp.Message = "Sorry — I didn't get that. Try using a quick action or ask about Inventory, Accessories, Create Vehicle, Home, or About.";
            resp.Buttons.Add(new ChatButton { Label = "Inventory", Action = "/Car/Inventory" });
            resp.Buttons.Add(new ChatButton { Label = "Help", Action = "#" });
            return Json(resp);
        }
    }
}
