/** Dev one-off: reset admin login to admin@admin.com / admin */
import { getPayload } from "../src/lib/payload/getPayload";

const EMAIL = "admin@admin.com";
const PASSWORD = "admin";

const payload = await getPayload();
const { docs } = await payload.find({
  collection: "users",
  limit: 10,
  overrideAccess: true,
});

const target = docs.find((u) => u.role === "admin") ?? docs[0];

if (!target) {
  await payload.create({
    collection: "users",
    data: {
      email: EMAIL,
      password: PASSWORD,
      name: "Admin",
      role: "admin",
      status: "active",
    },
    overrideAccess: true,
  });
  console.log(`Created admin: ${EMAIL} / ${PASSWORD}`);
} else {
  await payload.update({
    collection: "users",
    id: target.id,
    data: {
      email: EMAIL,
      password: PASSWORD,
      name: "Admin",
      role: "admin",
      status: "active",
    },
    overrideAccess: true,
  });
  console.log(`Updated user ${target.id}: ${EMAIL} / ${PASSWORD}`);
}

process.exit(0);
