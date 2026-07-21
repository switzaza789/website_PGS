export type Language = "th" | "en";
export type TierKey = "starter" | "core" | "founders";

export type MembershipTier = {
  key: TierKey;
  name: "STARTER" | "CORE" | "FOUNDERS";
  price: "10" | "100" | "1,000";
  rarity: "BRONZE PHOENIX" | "SILVER PHOENIX" | "GOLD PHOENIX";
  art: string;
  artAlt: Record<Language, string>;
};

export const tierOrder: TierKey[] = ["starter", "core", "founders"];

export const membershipTiers: Record<TierKey, MembershipTier> = {
  starter: {
    key: "starter",
    name: "STARTER",
    price: "10",
    rarity: "BRONZE PHOENIX",
    art: "/phoenix/bronze-phoenix.webp",
    artAlt: {
      th: "นกฟีนิกซ์ทองแดงวัยเริ่มต้นสำหรับสมาชิก Starter",
      en: "Young bronze phoenix for Starter membership",
    },
  },
  core: {
    key: "core",
    name: "CORE",
    price: "100",
    rarity: "SILVER PHOENIX",
    art: "/phoenix/silver-phoenix.webp",
    artAlt: {
      th: "นกฟีนิกซ์สีเงินโตเต็มวัยสำหรับสมาชิก Core",
      en: "Mature silver phoenix for Core membership",
    },
  },
  founders: {
    key: "founders",
    name: "FOUNDERS",
    price: "1,000",
    rarity: "GOLD PHOENIX",
    art: "/phoenix/gold-phoenix.webp",
    artAlt: {
      th: "นกฟีนิกซ์จักรพรรดิทองคำสำหรับสมาชิก Founders",
      en: "Sovereign gold phoenix for Founders membership",
    },
  },
};
