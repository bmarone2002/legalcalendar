export const LEGAL_VERSION = "2026-04-21";

type MetadataLike = Record<string, unknown>;

function readPublicMetadata(claims: unknown): MetadataLike | null {
  if (!claims || typeof claims !== "object") return null;
  const publicMetadata = (claims as Record<string, unknown>).publicMetadata;
  if (!publicMetadata || typeof publicMetadata !== "object") return null;
  return publicMetadata as MetadataLike;
}

export function hasAcceptedLegal(claims: unknown): boolean {
  const publicMetadata = readPublicMetadata(claims);
  if (!publicMetadata) return false;

  const acceptedVersion = publicMetadata.legalAcceptedVersion;
  const acceptedAt = publicMetadata.legalAcceptedAt;

  return acceptedVersion === LEGAL_VERSION && typeof acceptedAt === "string" && acceptedAt.length > 0;
}
