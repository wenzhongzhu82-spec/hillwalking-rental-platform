import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const DB_PATH = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace("file:", "") : `${process.cwd()}/dev.db`;

const adapter = new PrismaLibSql({ url: `file:${DB_PATH}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.adminNote.deleteMany();
  await prisma.userGearChecklist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.report.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.gearChecklistItem.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("password123", 12);

  // ========== USERS ==========
  const admin = await prisma.user.create({
    data: {
      name: "Admin Lee", email: "admin@scie.test", passwordHash: hash,
      role: "ADMIN", verified: true, grade: "Teacher", house: "None",
      rating: 5.0, creditScore: 100, completedOrders: 15,
      bio: "Platform administrator and Hillwalking club supervisor.",
    },
  });

  const teacher = await prisma.user.create({
    data: {
      name: "Ms. Chen", email: "teacher@scie.test", passwordHash: hash,
      role: "ADMIN", verified: true, grade: "Teacher", house: "None",
      rating: 4.8, creditScore: 98, completedOrders: 8,
      bio: "Geography teacher & Hillwalking club advisor.",
    },
  });

  const lender = await prisma.user.create({
    data: {
      name: "Alex Wang", email: "lender@scie.test", passwordHash: hash,
      role: "USER", verified: true, grade: "A2", house: "Fire",
      rating: 4.7, creditScore: 95, completedOrders: 12,
      bio: "A2 student. Love hiking and sharing gear!",
    },
  });

  const borrower = await prisma.user.create({
    data: {
      name: "Emma Liu", email: "borrower@scie.test", passwordHash: hash,
      role: "USER", verified: true, grade: "G2", house: "Water",
      rating: 4.3, creditScore: 88, completedOrders: 6,
      bio: "G2 student, new to hillwalking.",
    },
  });

  const users = [admin, teacher, lender, borrower];

  for (const s of [
    ["Ryan Zhang", "G1", "Wood"], ["Sophie Li", "G2", "Fire"],
    ["James Wu", "A1", "Metal"], ["Grace Tan", "A1", "Water"],
    ["Leo Huang", "A2", "Wood"], ["Mia Zhao", "G1", "Metal"],
  ]) {
    const u = await prisma.user.create({
      data: {
        name: s[0], email: `${s[0].toLowerCase().replace(" ", ".")}@scie.test`,
        passwordHash: hash, role: "USER", verified: true,
        grade: s[1], house: s[2], rating: 3 + Math.random() * 2,
        creditScore: 70 + Math.floor(Math.random() * 30),
        completedOrders: Math.floor(Math.random() * 10),
      },
    });
    users.push(u);
  }
  console.log(`✅ Created ${users.length} users`);

  // ========== CATEGORIES ==========
  const catData = [
    ["Backpacks", "backpacks"], ["Waterproof Gear", "waterproof-gear"],
    ["Trekking Poles", "trekking-poles"], ["Camping Gear", "camping-gear"],
    ["Lighting", "lighting"], ["Warm Clothing", "warm-clothing"],
    ["Cameras", "cameras"], ["Other", "other"],
  ];
  const catMap: Record<string, string> = {};
  for (const [name, slug] of catData) {
    const c = await prisma.category.create({ data: { name, slug } });
    catMap[slug] = c.id;
  }
  console.log(`✅ Created ${catData.length} categories`);

  // ========== ITEMS ==========
  const now = new Date();
  const fd = (d: number) => new Date(now.getTime() + d * 86400000);
  const pd = (d: number) => new Date(now.getTime() - d * 86400000);

  const items = [
    { t: "Osprey Hiking Backpack 45L", c: "backpacks", o: 0, b: "Osprey", sz: "45L", cd: "LIKE_NEW", p: 15, dp: 200, d: "Durable Osprey hiking backpack, 45L capacity. Perfect for day hikes and short overnight trips.", hw: true, s: "Check all straps and buckles before use.", tags: ["lightweight","durable","recommended for hillwalking"], l: "SCIE Antuoshan Campus" },
    { t: "Decathlon Raincoat Size L", c: "waterproof-gear", o: 1, b: "Decathlon", sz: "L", cd: "LIGHTLY_USED", p: 5, dp: 50, d: "Waterproof raincoat, bright orange. Folds into compact pouch.", hw: true, tags: ["waterproof","lightweight","compact","recommended for hillwalking"], l: "Dormitory Area" },
    { t: "Carbon Fiber Trekking Poles", c: "trekking-poles", o: 2, b: "Black Diamond", sz: "Adjustable", cd: "LIGHTLY_USED", p: 10, dp: 150, d: "Lightweight carbon fiber trekking poles. Adjustable height.", hw: true, tags: ["lightweight","durable","recommended for hillwalking","beginner friendly"], l: "SCIE Antuoshan Campus" },
    { t: "LED Headlamp 200 Lumens", c: "lighting", o: 3, b: "Petzl", cd: "LIKE_NEW", p: 3, dp: 30, d: "Bright LED headlamp with 3 modes. 8+ hours battery.", hw: true, s: "Check battery before use. Bring spare batteries.", tags: ["lightweight","compact","recommended for hillwalking"], l: "SCIE Antuoshan Campus" },
    { t: "Waterproof Phone Pouch", c: "waterproof-gear", o: 0, b: "JOTO", cd: "NEW", p: 0, dp: 20, d: "Universal waterproof phone pouch, IPX8 certified.", hw: true, tags: ["waterproof","free to borrow","compact"], l: "Library Entrance" },
    { t: "Lightweight Sleeping Bag", c: "camping-gear", o: 1, b: "Naturehike", sz: "190x75cm", cd: "LIGHTLY_USED", p: 8, dp: 100, d: "Compact sleeping bag rated 5-15°C. Weighs 800g.", hw: true, tags: ["lightweight","compact","warm","recommended for hillwalking"], l: "Dormitory Area" },
    { t: "Foam Camping Mat", c: "camping-gear", o: 2, b: "Decathlon", sz: "180x50cm", cd: "VISIBLY_USED", p: 2, dp: 25, d: "Basic foam camping mat with straps.", hw: false, tags: ["lightweight"], l: "SCIE Antuoshan Campus" },
    { t: "Anker Power Bank 20000mAh", c: "other", o: 3, b: "Anker", cd: "LIKE_NEW", p: 3, dp: 80, d: "High capacity power bank. 4-5 phone charges.", hw: true, s: "Do not expose to extreme heat. Return fully charged.", tags: ["recommended for hillwalking","urgent available"], l: "SCIE Antuoshan Campus" },
    { t: "Winter Waterproof Gloves", c: "warm-clothing", o: 0, b: "The North Face", sz: "M", cd: "LIGHTLY_USED", p: 4, dp: 40, d: "Waterproof winter gloves with fleece lining.", hw: true, tags: ["waterproof","warm","recommended for hillwalking"], l: "SCIE Antuoshan Campus" },
    { t: "Knee Support Brace", c: "other", o: 1, b: "LP", sz: "Adjustable", cd: "LIGHTLY_USED", p: 2, dp: 25, d: "Adjustable knee support brace for downhill sections.", hw: true, s: "Ensure proper fit. Do not overtighten.", tags: ["beginner friendly","recommended for hillwalking"], l: "Sports Field" },
    { t: "Outdoor Sun Hat UPF50+", c: "warm-clothing", o: 2, b: "Columbia", cd: "LIKE_NEW", p: 0, dp: 15, d: "Wide brim sun hat, quick-dry material.", hw: true, tags: ["free to borrow","lightweight","quick dry","recommended for hillwalking"], l: "SCIE Antuoshan Campus" },
    { t: "Quick-Dry Travel Towel", c: "other", o: 3, b: "Sea to Summit", sz: "L", cd: "NEW", p: 1, dp: 20, d: "Microfiber quick-dry towel with carrying pouch.", hw: false, tags: ["lightweight","compact","quick dry"], l: "Dormitory Area" },
    { t: "GoPro Hero 9 Action Camera", c: "cameras", o: 0, b: "GoPro", cd: "LIKE_NEW", p: 20, dp: 500, d: "GoPro Hero 9 Black with accessories. 5K video, waterproof housing.", hw: false, s: "Check waterproof housing seals before water use. Handle with care.", tags: ["deposit required","urgent available"], l: "SCIE Antuoshan Campus" },
    { t: "Orienteering Compass", c: "other", o: 1, b: "Silva", cd: "LIKE_NEW", p: 0, dp: 10, d: "Precise compass with luminous markings.", hw: true, tags: ["free to borrow","lightweight","compact","recommended for hillwalking"], l: "Library Entrance" },
    { t: "Thermos Bottle 750ml", c: "other", o: 2, b: "Thermos", sz: "750ml", cd: "LIGHTLY_USED", p: 2, dp: 30, d: "Stainless steel vacuum bottle. 12h hot, 24h cold.", hw: true, tags: ["durable","recommended for hillwalking"], l: "Cafeteria" },
    { t: "Compact First Aid Kit", c: "other", o: 3, b: "Adventure Medical", cd: "NEW", p: 0, dp: 25, d: "Small first aid kit for day trips.", hw: true, s: "Check expiration dates before use. Replace used items.", tags: ["free to borrow","compact","recommended for hillwalking"], l: "SCIE Antuoshan Campus" },
    { t: "Lightweight Waterproof Jacket", c: "waterproof-gear", o: 0, b: "Patagonia", sz: "M", cd: "LIGHTLY_USED", p: 12, dp: 180, d: "Very lightweight waterproof shell. Packs into own pocket.", hw: true, tags: ["waterproof","lightweight","recommended for hillwalking","compact"], l: "SCIE Antuoshan Campus" },
    { t: "Merino Wool Hiking Socks (3pr)", c: "warm-clothing", o: 1, b: "Smartwool", sz: "M", cd: "NEW", p: 2, dp: 30, d: "Moisture wicking merino wool hiking socks.", hw: true, tags: ["warm","quick dry","recommended for hillwalking"], l: "Dormitory Area" },
    { t: "Small Daypack 20L", c: "backpacks", o: 2, b: "Deuter", sz: "20L", cd: "LIGHTLY_USED", p: 5, dp: 60, d: "Compact 20L daypack with mesh back panel.", hw: true, tags: ["lightweight","compact","recommended for hillwalking"], l: "SCIE Antuoshan Campus" },
    { t: "Sports Sunglasses UV400", c: "other", o: 3, b: "Oakley", cd: "LIKE_NEW", p: 3, dp: 80, d: "Polarized sports sunglasses with hard case.", hw: true, tags: ["lightweight","durable"], l: "Sports Field" },
    { t: "Emergency Rain Poncho", c: "waterproof-gear", o: 0, b: "Generic", cd: "NEW", p: 0, dp: 5, d: "Disposable emergency poncho. Fits over backpack.", hw: true, tags: ["waterproof","lightweight","compact","free to borrow","urgent available"], l: "SCIE Antuoshan Campus" },
    { t: "Warm Fleece Jacket Size L", c: "warm-clothing", o: 1, b: "Uniqlo", sz: "L", cd: "LIGHTLY_USED", p: 6, dp: 60, d: "Soft polar fleece jacket. Great mid-layer.", hw: true, tags: ["warm","quick dry","beginner friendly"], l: "Dormitory Area" },
    { t: "Waterproof Shoe Covers", c: "waterproof-gear", o: 2, b: "Generic", sz: "Universal", cd: "LIGHTLY_USED", p: 1, dp: 15, d: "Reusable waterproof shoe covers with anti-slip sole.", hw: true, tags: ["waterproof","lightweight","compact"], l: "Sports Field" },
    { t: "20L Dry Bag", c: "waterproof-gear", o: 3, b: "Sea to Summit", sz: "20L", cd: "NEW", p: 4, dp: 40, d: "Roll-top waterproof dry bag, bright yellow.", hw: true, tags: ["waterproof","durable","recommended for hillwalking"], l: "SCIE Antuoshan Campus" },
    { t: "High-Power Flashlight 1000LM", c: "lighting", o: 0, b: "Fenix", cd: "LIKE_NEW", p: 3, dp: 35, d: "LED flashlight, 1000 lumens, water resistant.", hw: true, s: "Check batteries before use. Do not shine in eyes.", tags: ["durable","recommended for hillwalking"], l: "SCIE Antuoshan Campus" },
    { t: "Sun Protection Arm Sleeves", c: "warm-clothing", o: 1, b: "Generic", cd: "NEW", p: 0, dp: 10, d: "UV protection arm sleeves UPF50+.", hw: false, tags: ["lightweight","quick dry","free to borrow"], l: "Sports Field" },
    { t: "Hiking Belt with Pockets", c: "other", o: 2, cd: "LIGHTLY_USED", p: 1, dp: 15, d: "Adjustable hiking belt with two zippered pockets.", hw: false, tags: ["lightweight","compact","beginner friendly"], l: "Library Entrance" },
    { t: "Compact Digital Camera", c: "cameras", o: 3, b: "Sony", cd: "LIGHTLY_USED", p: 15, dp: 300, d: "Sony compact 20MP camera with image stabilization.", hw: false, s: "Keep lens clean. Return in provided case.", tags: ["deposit required"], l: "SCIE Antuoshan Campus" },
    { t: "Emergency Whistle 120dB", c: "other", o: 0, b: "ACME", cd: "NEW", p: 0, dp: 5, d: "Loud emergency whistle, works when wet.", hw: true, s: "For emergency use only. Test briefly before trip.", tags: ["free to borrow","lightweight","compact","recommended for hillwalking"], l: "SCIE Antuoshan Campus" },
    { t: "Camping Stove Set", c: "camping-gear", o: 1, b: "MSR", cd: "LIGHTLY_USED", p: 10, dp: 100, d: "Compact camping stove with pot, pan, and spork.", hw: false, s: "Use in well-ventilated area only. Gas not included.", tags: ["durable","deposit required"], l: "Dormitory Area" },
  ];

  const createdItems = [];
  for (const it of items) {
    const item = await prisma.item.create({
      data: {
        title: it.t, description: it.d, categoryId: catMap[it.c],
        ownerId: users[it.o].id, brand: it.b || null, size: it.sz || null,
        condition: it.cd || "LIGHTLY_USED", dailyPrice: it.p, deposit: it.dp,
        pickupLocation: it.l, isHillwalkingRecommended: it.hw ?? false,
        safetyNotes: it.s || null, tags: JSON.stringify(it.tags || []),
        images: JSON.stringify([]), status: "AVAILABLE",
        availableFrom: pd(1), availableTo: fd(90),
        viewCount: Math.floor(Math.random() * 50),
        favoriteCount: Math.floor(Math.random() * 10),
      },
    });
    createdItems.push(item);
  }
  console.log(`✅ Created ${createdItems.length} items`);

  // ========== ORDERS ==========
  const orderStatuses = ["COMPLETED", "IN_USE", "REQUEST_PENDING", "ACCEPTED", "COMPLETED", "DISPUTE_OPENED"] as const;
  for (let i = 0; i < 6; i++) {
    const item = createdItems[i * 5];
    const borrowerUser = users[4 + (i % 6)];
    const sd = i < 2 ? pd(10) : fd(i * 2);
    const ed = i < 2 ? pd(3) : fd(i * 2 + 3);
    await prisma.order.create({
      data: {
        itemId: item.id, borrowerId: borrowerUser.id, lenderId: item.ownerId,
        startDate: sd, endDate: ed,
        totalPrice: item.dailyPrice * Math.max(1, Math.ceil((ed.getTime() - sd.getTime()) / 86400000)),
        deposit: item.deposit,
        borrowerNote: "I'd like to borrow this for hillwalking!",
        status: orderStatuses[i],
        statusHistory: JSON.stringify([{ status: "REQUEST_PENDING", at: now.toISOString() }]),
      },
    });
  }
  for (let i = 0; i < 4; i++) {
    const item = createdItems[10 + i];
    const borrowerUser = users[4 + ((i + 2) % 6)];
    await prisma.order.create({
      data: {
        itemId: item.id, borrowerId: borrowerUser.id, lenderId: item.ownerId,
        startDate: fd(i + 5), endDate: fd(i + 8),
        totalPrice: item.dailyPrice * 3, deposit: item.deposit,
        status: "REQUEST_PENDING",
        statusHistory: JSON.stringify([{ status: "REQUEST_PENDING", at: now.toISOString() }]),
      },
    });
  }
  console.log("✅ Created 10 orders");

  // ========== MESSAGE THREADS ==========
  const orders = await prisma.order.findMany({ take: 5 });
  for (const ord of orders) {
    const thread = await prisma.messageThread.create({
      data: { itemId: ord.itemId, borrowerId: ord.borrowerId, lenderId: ord.lenderId },
    });
    const msgs = [
      [ord.borrowerId, "Hi! Is this still available? I need it for next week's hillwalking.", "TEXT"],
      [ord.lenderId, "Yes, it's available! When would you like to pick it up?", "TEXT"],
      [ord.borrowerId, "I can come to campus any day after 3pm. Does that work?", "TEXT"],
      [ord.lenderId, "Sure! Let's meet at the library entrance on Monday 3:30pm.", "TEXT"],
      [users[0].id, "Rental request has been processed.", "SYSTEM"],
    ];
    for (const [sid, content, type] of msgs) {
      await prisma.message.create({
        data: { threadId: thread.id, senderId: sid as string, content: content as string, type: type as string },
      });
    }
  }
  console.log("✅ Created 5 message threads with messages");

  // ========== REVIEWS ==========
  const reviewTexts = ["Great renter, returned on time!", "Very responsible borrower.", "Item came back clean.", "Good communication, smooth transaction."];
  for (let i = 0; i < 8; i++) {
    const ord = orders[i % orders.length];
    await prisma.review.create({
      data: {
        orderId: ord.id, reviewerId: ord.lenderId, revieweeId: ord.borrowerId,
        rating: 3 + Math.floor(Math.random() * 3),
        content: reviewTexts[i % 4],
        punctuality: 3 + Math.floor(Math.random() * 3),
        itemAccuracy: 4 + Math.floor(Math.random() * 2),
        communication: 4 + Math.floor(Math.random() * 2),
        recommended: i < 6,
      },
    });
  }
  console.log("✅ Created 8 reviews");

  // ========== FAVORITES ==========
  for (let i = 4; i < 10; i++) {
    for (const it of createdItems.slice(i, i + 3)) {
      await prisma.favorite.upsert({
        where: { userId_itemId: { userId: users[i].id, itemId: it.id } },
        create: { userId: users[i].id, itemId: it.id },
        update: {},
      }).catch(() => {});
    }
  }
  console.log("✅ Created favorites");

  // ========== GEAR CHECKLIST ==========
  const gearItems = [
    { n: "Water Bottle", c: "ESSENTIAL", i: 5, d: "At least 1L water capacity.", w: null },
    { n: "Raincoat", c: "ESSENTIAL", i: 5, d: "Weather changes quickly in the hills.", w: "rain" },
    { n: "Comfortable Shoes", c: "ESSENTIAL", i: 5, d: "Proper hiking shoes with good grip.", w: null },
    { n: "Backpack 20-45L", c: "ESSENTIAL", i: 5, d: "Comfortable backpack for all your gear.", w: null },
    { n: "Hat / Cap", c: "ESSENTIAL", i: 4, d: "Sun protection for your face and head.", w: null },
    { n: "Towel", c: "ESSENTIAL", i: 3, d: "Quick-dry towel.", w: null },
    { n: "Extra Clothes", c: "ESSENTIAL", i: 4, d: "Spare t-shirt and socks.", w: null },
    { n: "Trekking Poles", c: "RECOMMENDED", i: 4, d: "Reduce knee strain on steep descents.", w: null },
    { n: "Sunscreen SPF50+", c: "RECOMMENDED", i: 4, d: "UV is stronger at altitude.", w: null },
    { n: "Power Bank", c: "RECOMMENDED", i: 3, d: "Keep your phone charged for navigation.", w: null },
    { n: "Headlamp", c: "RECOMMENDED", i: 4, d: "Essential for early starts or late returns.", w: null },
    { n: "Gloves", c: "RECOMMENDED", i: 3, d: "Protects hands in cold weather.", w: "cold" },
    { n: "Knee Support", c: "RECOMMENDED", i: 3, d: "Long descents can be hard on knees.", w: null },
    { n: "Waterproof Jacket", c: "WEATHER_SPECIFIC", i: 5, d: "Breathable waterproof protection.", w: "rain" },
    { n: "Warm Layer / Fleece", c: "WEATHER_SPECIFIC", i: 4, d: "Temperature drops at higher altitude.", w: "cold" },
    { n: "Anti-Slip Shoe Covers", c: "WEATHER_SPECIFIC", i: 3, d: "Extra grip for wet or muddy trails.", w: "rain" },
    { n: "Waterproof Dry Bag", c: "WEATHER_SPECIFIC", i: 4, d: "Keep electronics and clothes dry.", w: "rain" },
  ];
  const createdGear = [];
  for (const g of gearItems) {
    createdGear.push(await prisma.gearChecklistItem.create({ data: { name: g.n, category: g.c, importance: g.i, description: g.d, recommendedForWeather: g.w } }));
  }
  console.log(`✅ Created ${createdGear.length} gear checklist items`);

  // ========== ANNOUNCEMENTS ==========
  await prisma.announcement.createMany({
    data: [
      { title: "Hillwalking Season is Here!", content: "Prepare your gear for the best hillwalking season in Shenzhen! Use the Gear Checklist to check what you need, and borrow from fellow SCIE students.", type: "HILLWALKING", createdById: admin.id },
      { title: "Safety Reminder: Check Gear Before Use", content: "All borrowers should inspect gear before taking it on a hillwalking trip. Check for damage and test electronics. Your safety comes first!", type: "SAFETY", createdById: admin.id },
      { title: "Platform Rules Updated", content: "Key changes: admin review required for new items, reports processed within 24h, free items highlighted on homepage. Read full rules at /rules.", type: "RULES", createdById: admin.id },
      { title: "Lost & Found: Water Bottle", content: "A blue Nalgene water bottle found near the sports field. Contact admin office if yours.", type: "LOST_FOUND", createdById: admin.id },
    ],
  });
  console.log("✅ Created 4 announcements");

  // ========== HILLWALKING EVENT ==========
  await prisma.hillwalkingEvent.create({
    data: { name: "SCIE Autumn Hillwalking Day", description: "Annual SCIE autumn hillwalking! Wutong Mountain trail.", eventDate: fd(14), createdById: admin.id },
  });
  console.log("✅ Created 1 hillwalking event");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Seed completed successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test Accounts (password: password123):");
  console.log("  Admin:   admin@scie.test");
  console.log("  Teacher: teacher@scie.test");
  console.log("  Lender:  lender@scie.test");
  console.log("  Borrower: borrower@scie.test");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
