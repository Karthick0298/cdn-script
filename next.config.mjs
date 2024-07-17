/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'ik.imagekit.io',
			},
            {
				protocol: 'https',
				hostname: 'java-files.s3.ap-south-1.amazonaws.com',
			},           
		],
	},
};

export default nextConfig;
