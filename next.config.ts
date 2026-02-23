import type { NextConfig } from "next";
import path from "path";

const projectRoot = process.cwd();
const generatedPrisma = path.resolve(projectRoot, "src/generated/prisma");

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Use our generated Prisma client (with macroType, etc.) instead of node_modules
      "@prisma/client": generatedPrisma,
    },
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["@prisma/client"] = generatedPrisma;
    return config;
  },
};

export default nextConfig;
