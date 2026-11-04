import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${process.env.BACKEND_URL ?? "http://localhost:8080"}/:path*`,
			},
			{
				source: "/auth-api/:path*",
				destination: `${process.env.AUTH_SERVICE_URL ?? "http://localhost:8081"}/:path*`,
			},
		];
	},
};

export default nextConfig;
