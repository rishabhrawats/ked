import asyncio
import os
import secrets
from datetime import datetime, timezone

from dotenv import load_dotenv
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient


load_dotenv()

def hash_password(value: str) -> str:
    return bcrypt.hashpw(value.encode("utf-8"), bcrypt.gensalt(rounds=12)).decode("utf-8")

FOUNDERS = [
    ("f1", "Priya Rathod", "Kutch Kala Creations", "Handcrafted Textiles & Embroidery", "Bhuj, Kutch", "Textiles & Fashion", "https://images.unsplash.com/photo-1630457497120-609b2a74578c?auto=format&fit=crop&w=900&q=85", "+919876543210"),
    ("f2", "Meera Joshi", "Meera's Wellness Studio", "Holistic Wellness & Yoga Training", "Ahmedabad, Gujarat", "Wellness & Health", "https://images.unsplash.com/photo-1714976327142-d2aa96c1fb7f?auto=format&fit=crop&w=900&q=85", "+919876543211"),
    ("f3", "Anita Parmar", "Rann of Flavours", "Authentic Kutchi Snacks & Spices", "Mandvi, Kutch", "Food & Spices", "https://images.unsplash.com/photo-1646578486121-67aed93c4f4e?auto=format&fit=crop&w=900&q=85", "+919876543212"),
    ("f4", "Kavita Mehta", "Kavita Design Studio", "Brand Design & Digital Marketing", "Mumbai, Maharashtra", "Design & Marketing", "https://images.unsplash.com/photo-1613943093160-3371121d7ed2?auto=format&fit=crop&w=900&q=85", "+919876543213"),
    ("f5", "Sonal Patel", "Sonal's Silver Craft", "Handcrafted Silver Jewellery", "Rajkot, Gujarat", "Jewellery", "https://images.unsplash.com/photo-1663436683739-a32f2f078a80?auto=format&fit=crop&w=900&q=85", "+919876543214"),
    ("f6", "Fatima Sheikh", "Fatima's Pottery Studio", "Artisanal Pottery & Ceramics", "Khavda, Kutch", "Home & Decor", "https://images.unsplash.com/photo-1698768195616-2d49cb36477f?auto=format&fit=crop&w=900&q=85", "+919876543215"),
    ("f7", "Radha Sharma", "Radha's Art Academy", "Art Education & Creative Workshops", "Jaipur, Rajasthan", "Education & Training", "https://images.unsplash.com/photo-1678082309214-3b2941e387f8?auto=format&fit=crop&w=900&q=85", "+919876543216"),
    ("f8", "Deepika Nair", "AyurGlow Naturals", "Organic Skincare & Wellness", "Kochi, Kerala", "Beauty & Skincare", "https://images.unsplash.com/photo-1650434951802-6f2d183b8ffe?auto=format&fit=crop&w=900&q=85", "+919876543217"),
]

PRODUCTS = [
    ("p1", "f1", "Kutchi Embroidered Clutch", 1850, 2200, "Fashion", "https://images.unsplash.com/photo-1758560936904-4eb0049284aa?auto=format&fit=crop&w=900&q=85", "Hand-embroidered clutch featuring traditional Kutchi mirror work and Rabari stitching."),
    ("p2", "f8", "Organic Turmeric Face Cream", 650, 850, "Beauty", "https://images.unsplash.com/photo-1672883589583-c82951069154?auto=format&fit=crop&w=900&q=85", "Face cream enriched with wild turmeric, saffron, and almond oil."),
    ("p3", "f1", "Handwoven Silk Stole", 3200, 3800, "Fashion", "https://images.unsplash.com/photo-1766560360701-ebbae5faf95a?auto=format&fit=crop&w=900&q=85", "Handwoven silk stole with traditional Patola patterns and natural dyes."),
    ("p4", "f5", "Silver Oxidised Jhumkas", 1200, 1500, "Jewellery", "https://images.unsplash.com/photo-1618840392859-848a38cfa9b8?auto=format&fit=crop&w=900&q=85", "Intricately designed oxidised silver jhumkas inspired by Indian heritage."),
    ("p5", "f3", "Kutchi Masala Gift Box", 899, 1100, "Food", "https://images.unsplash.com/photo-1603533627544-4b256401b1ee?auto=format&fit=crop&w=900&q=85", "A curated box of six authentic Kutchi masalas, hand-ground and packed fresh."),
    ("p6", "f6", "Hand-painted Ceramic Vase", 2400, 2800, "Home Decor", "https://images.unsplash.com/photo-1672302255324-28009cc288b2?auto=format&fit=crop&w=900&q=85", "Hand-painted ceramic vase inspired by the Rann of Kutch landscape."),
    ("p7", "f8", "Lavender & Rose Soap Set", 480, 600, "Beauty", "https://images.unsplash.com/photo-1603533627544-4b256401b1ee?auto=format&fit=crop&w=900&q=85", "Four handmade cold-process soaps infused with lavender and rose essential oils."),
    ("p8", "f1", "Bandhani Dupatta", 1650, 2000, "Fashion", "https://images.unsplash.com/photo-1722963295947-c6f8f1c50de2?auto=format&fit=crop&w=900&q=85", "Traditional Bandhani tie-dye dupatta, hand-tied by skilled artisans from Kutch."),
]

SERVICES = [
    ("s1", "f4", "Personal Branding Workshop", 2999, "per session", "2 hours", "Workshop", "Business", "Learn to build a clear personal brand for your business."),
    ("s2", "f2", "Yoga & Mindfulness for Entrepreneurs", 1500, "per month", "45 min daily", "Weekly Class", "Wellness", "Yoga and meditation sessions designed for busy entrepreneurs."),
    ("s3", "f1", "Kutchi Embroidery Masterclass", 3500, "4 sessions", "1.5 hours each", "Course", "Craft", "Learn traditional Kutchi embroidery from an experienced artisan."),
    ("s4", "f4", "Business Plan Consultation", 4999, "per session", "90 minutes", "Consultation", "Business", "One-on-one consultation for planning, pricing, and growth."),
    ("s5", "f7", "Art Therapy & Creative Expression", 1200, "per session", "2 hours", "Workshop", "Education", "Guided creative expression sessions for women."),
    ("s6", "f8", "Organic Skincare DIY Workshop", 1800, "per session", "2.5 hours", "Workshop", "Beauty", "Learn to make organic skincare products using natural ingredients."),
]

WORKSHOPS = [
    ("w1", "Digital Marketing Essentials for Women Entrepreneurs", "Kavita Mehta", "2026-07-18", "10:00 AM - 1:00 PM", 1499),
    ("w2", "Pricing Your Products Right: A KED Masterclass", "KED Business Team", "2026-07-25", "2:00 PM - 4:30 PM", 999),
    ("w3", "GST & Compliance Made Simple", "CA Sunita Agarwal", "2026-08-01", "11:00 AM - 1:00 PM", 0),
    ("w4", "Product Photography with Your Phone", "Radha Sharma", "2026-08-08", "3:00 PM - 5:00 PM", 799),
]


async def bootstrap() -> None:
    mongo_url = os.getenv("MONGO_URL", "mongodb://127.0.0.1:27017")
    db_name = os.getenv("DB_NAME", "ked_prod")
    admin_email = os.getenv("ADMIN_EMAIL", "admin@edigital-prod.cloud").lower()
    admin_password = os.getenv("ADMIN_PASSWORD")
    if not admin_password or len(admin_password) < 12:
        raise RuntimeError("ADMIN_PASSWORD must be set to at least 12 characters")

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    now = datetime.now(timezone.utc)
    admin = {
        "id": "usr_super_admin",
        "name": "KED Super Admin",
        "email": admin_email,
        "phone": "",
        "password_hash": hash_password(admin_password),
        "role": "super_admin",
        "status": "active",
        "profile_id": None,
        "created_at": now,
        "updated_at": now,
    }
    await db.users.update_one(
        {"id": admin["id"]},
        {"$set": admin},
        upsert=True,
    )

    profile_map = {}
    for founder_id, name, business, tagline, location, category, image, whatsapp in FOUNDERS:
        owner_id = f"usr_demo_{founder_id}"
        profile_map[founder_id] = founder_id
        await db.users.update_one(
            {"id": owner_id},
            {
                "$setOnInsert": {
                    "id": owner_id,
                    "name": name,
                    "email": f"demo+{founder_id}@edigital-prod.cloud",
                    "phone": whatsapp,
                    "password_hash": hash_password(secrets.token_urlsafe(24)),
                    "role": "seller",
                    "status": "active",
                    "profile_id": founder_id,
                    "created_at": now,
                },
                "$set": {"updated_at": now},
            },
            upsert=True,
        )
        await db.profiles.update_one(
            {"id": founder_id},
            {
                "$set": {
                    "id": founder_id,
                    "owner_id": owner_id,
                    "name": name,
                    "business": business,
                    "tagline": tagline,
                    "location": location,
                    "category": category,
                    "story": f"{name} is building {business}, a women-led business serving customers across India.",
                    "image": image,
                    "social": {"instagram": "", "whatsapp": whatsapp},
                    "verified": True,
                    "status": "published",
                    "badges": ["Verified Seller", "Women-Led"],
                    "rating": 4.8,
                    "reviews": 0,
                    "created_at": now,
                    "updated_at": now,
                }
            },
            upsert=True,
        )

    for item_id, founder_id, name, price, original_price, category, image, description in PRODUCTS:
        await db.products.update_one(
            {"id": item_id},
            {
                "$set": {
                    "id": item_id,
                    "owner_id": f"usr_demo_{founder_id}",
                    "profile_id": profile_map[founder_id],
                    "name": name,
                    "description": description,
                    "price": price,
                    "originalPrice": original_price,
                    "category": category,
                    "image": image,
                    "images": [image],
                    "tags": ["Women-Led", "KED Verified"],
                    "status": "published",
                    "verified": True,
                    "rating": 4.8,
                    "reviews": 0,
                    "isNew": item_id in {"p1", "p3", "p5", "p7"},
                    "created_at": now,
                    "updated_at": now,
                    "published_at": now,
                }
            },
            upsert=True,
        )

    for item_id, founder_id, name, price, price_type, duration, service_type, category, description in SERVICES:
        profile = next(item for item in FOUNDERS if item[0] == founder_id)
        await db.services.update_one(
            {"id": item_id},
            {
                "$set": {
                    "id": item_id,
                    "owner_id": f"usr_demo_{founder_id}",
                    "profile_id": founder_id,
                    "name": name,
                    "description": description,
                    "price": price,
                    "priceType": price_type,
                    "duration": duration,
                    "type": service_type,
                    "category": category,
                    "image": profile[6],
                    "images": [profile[6]],
                    "tags": ["Women-Led", "KED Verified"],
                    "slots": [],
                    "isOnline": True,
                    "status": "published",
                    "rating": 4.8,
                    "reviews": 0,
                    "created_at": now,
                    "updated_at": now,
                    "published_at": now,
                }
            },
            upsert=True,
        )

    for item_id, title, instructor, date, time, price in WORKSHOPS:
        await db.workshops.update_one(
            {"id": item_id},
            {
                "$set": {
                    "id": item_id,
                    "title": title,
                    "instructor": instructor,
                    "date": date,
                    "time": time,
                    "price": price,
                    "type": "Online",
                    "image": FOUNDERS[3][6],
                    "spots": 25,
                    "totalSpots": 50,
                    "status": "published",
                    "created_at": now,
                    "updated_at": now,
                }
            },
            upsert=True,
        )

    await db.settings.update_one(
        {"id": "platform"},
        {
            "$setOnInsert": {
                "id": "platform",
                "support_email": "hello@ked.in",
                "support_phone": "+919876543210",
                "default_whatsapp": "+919876543210",
                "announcement": "",
                "created_at": now,
            },
            "$set": {"updated_at": now},
        },
        upsert=True,
    )
    client.close()
    print(f"KED bootstrap complete. Super Admin: {admin_email}")


if __name__ == "__main__":
    asyncio.run(bootstrap())
