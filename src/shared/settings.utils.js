export const getSortedBookmarks = (bookmarks, settings) => {
  return new Set([
    ...((settings && settings.bookmarksOrder) || []),
    ...Object.keys(bookmarks),
  ]);
};
