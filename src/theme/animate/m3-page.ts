export const M3_MOTION_EASE = {
  decelerate: [0.05, 0.7, 0.1, 1] as [number, number, number, number],
  accelerate: [0.3, 0, 0.8, 0.15] as [number, number, number, number],
  expressive: [0.34, 1.4, 0.64, 1] as [number, number, number, number],
};

export const NAV_ROUTES = ["/dashboard", "/conversation", "/settings"] as const;

export function getNavDirection(prevPath: string, nextPath: string): number {
  const prevIdx = NAV_ROUTES.findIndex((route) => prevPath.startsWith(route));
  const nextIdx = NAV_ROUTES.findIndex((route) => nextPath.startsWith(route));

  if (prevIdx === -1 || nextIdx === -1 || prevIdx === nextIdx) return 0;
  return nextIdx > prevIdx ? 1 : -1;
}

let previousNavPathname = "";

/** Arah slide antar tab; state disimpan di modul agar tetap akurat saat template remount. */
export function consumeNavDirection(currentPathname: string): number {
  const direction = getNavDirection(previousNavPathname, currentPathname);
  previousNavPathname = currentPathname;
  return direction;
}

export const m3PageVariants = {
  initial: (direction: number) => ({
    x: direction === 0 ? 0 : direction * 36,
    opacity: 0,
    scale: 0.96,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.34,
      ease: M3_MOTION_EASE.decelerate,
    },
  },
  exit: (direction: number) => ({
    x: direction === 0 ? 0 : direction * -24,
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.24,
      ease: M3_MOTION_EASE.accelerate,
    },
  }),
};

export const m3AuthPageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: M3_MOTION_EASE.decelerate },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.25, ease: M3_MOTION_EASE.accelerate },
  },
};
