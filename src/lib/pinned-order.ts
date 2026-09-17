/** Keep pinned items ahead of the list's own title/date sort order. */
export function comparePinned(left: { pinned: boolean }, right: { pinned: boolean }): number {
  return Number(right.pinned) - Number(left.pinned)
}
