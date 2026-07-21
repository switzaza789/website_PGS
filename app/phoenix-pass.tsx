import Image from "next/image";
import type { Language, TierKey } from "./membership-tiers";
import { membershipTiers } from "./membership-tiers";

type PhoenixPassProps = {
  tier: TierKey;
  language: Language;
  variant?: "mini" | "full" | "hero" | "dashboard";
  className?: string;
  memberId?: string;
  memberSince?: string;
};

export function PhoenixPass({
  tier,
  language,
  variant = "full",
  className = "",
  memberId,
  memberSince,
}: PhoenixPassProps) {
  const tierData = membershipTiers[tier];

  return (
    <div
      className={`phoenix-pass phoenix-pass--${tier} phoenix-pass--${variant} ${className}`.trim()}
      data-tier={tierData.key}
    >
      <Image
        className="phoenix-pass__art"
        src={tierData.art}
        alt={tierData.artAlt[language]}
        fill
        unoptimized
        sizes="(max-width: 720px) 78vw, (max-width: 1100px) 60vw, 360px"
      />
      <div className="phoenix-pass__shade" aria-hidden="true" />
      <div className="phoenix-pass__rings" aria-hidden="true" />
      <div className="phoenix-pass__copy">
        <small>PGS · DIGITAL MEMBERSHIP</small>
        <strong>{tierData.name}</strong>
        <span className="phoenix-pass__rarity">{tierData.rarity}</span>
        {memberId ? <b>{memberId}</b> : <i>{tierData.price} USDT</i>}
        {memberSince ? <em>{memberSince}</em> : null}
      </div>
    </div>
  );
}
