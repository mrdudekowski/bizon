import fs from "node:fs";
import path from "node:path";

import { SITE_CONTACT } from "@/constants/contact";
import {
  assertPublicSiteReadiness,
  findPublicSiteReadinessIssues,
  PUBLIC_LOGO,
  PUBLIC_OG_IMAGE,
} from "@/lib/readiness/publicSite";
import { getSiteUrl } from "@/lib/seo/metadata";

const publicAssets = new Set(
  [PUBLIC_OG_IMAGE, PUBLIC_LOGO].filter((asset) =>
    fs.existsSync(path.join(process.cwd(), "public", asset.replace(/^\//, ""))),
  ),
);

const issues = findPublicSiteReadinessIssues({
  phone: SITE_CONTACT.phone,
  email: SITE_CONTACT.email,
  siteUrl: getSiteUrl(),
  publicAssets,
});

assertPublicSiteReadiness(issues);
console.log("Public-site readiness checks passed");
