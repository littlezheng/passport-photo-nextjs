import type { NextConfig } from "next";
import { getGitVersion } from "./src/lib/getGitVersion";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    GIT_COMMIT_SHA: getGitVersion(),
  },
};

export default nextConfig;
