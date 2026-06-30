const AVATAR_COLORS = ["#FA7D19", "#4785FF", "#14B862", "#8B7CF6", "#E85D75", "#00B8D9"];

function hashSeed(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getAvatarColor(seed: string) {
  return AVATAR_COLORS[hashSeed(seed) % AVATAR_COLORS.length];
}
