"use client";

// react-leaflet touches window/DOM APIs at module scope, so it can only ever
// run in the browser. Server Components can't pass `ssr: false` to
// next/dynamic directly — that option has to live inside a Client Component,
// which is all this file does. Pages import SiteMap from here instead of
// from site-map.tsx directly.
import dynamic from "next/dynamic";

export const SiteMap = dynamic(() => import("./site-map").then((m) => m.SiteMap), {
  ssr: false,
});
