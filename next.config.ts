import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site used to be nine separate routes; it's now one continuous-scroll
  // page with each old page as an in-page section. These keep any
  // bookmarked or previously-shared links working by landing on the right
  // section instead of a 404. Low-risk for SEO since layout.tsx already sets
  // robots: { index: false, follow: false } — there's no duplicate-content
  // concern to weigh against it.
  async redirects() {
    return [
      { source: "/our-story", destination: "/#our-story", permanent: true },
      { source: "/venue", destination: "/#venue", permanent: true },
      { source: "/timetable", destination: "/#timetable", permanent: true },
      { source: "/where-to-stay", destination: "/#where-to-stay", permanent: true },
      { source: "/dress-code", destination: "/#dress-code", permanent: true },
      { source: "/registry", destination: "/#registry", permanent: true },
      { source: "/faq", destination: "/#faq", permanent: true },
      { source: "/rsvp", destination: "/#rsvp", permanent: true },
    ];
  },
};

export default nextConfig;
