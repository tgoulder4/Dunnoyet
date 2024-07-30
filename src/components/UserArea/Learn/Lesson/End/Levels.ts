export function getLevel(experience: number) {
    return Math.round(experience / 10) * 10;
}