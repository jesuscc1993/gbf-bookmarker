# Development notes

## Compact Bookmarks

Replace

```
\{\n\s*("element": ".*",)\n\s*("url": ".*")\n\s*\}
```

with

```
{$1 $2}
```
