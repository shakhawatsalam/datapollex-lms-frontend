/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "bairesdev.mo.cloudinary.net",
      "example.com",
      "www.tutorialrepublic.com",
      "res.cloudinary.com",
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/courses/:id",
        destination: "/courses/:id",
      },
      {
        source: "/:path*",
        destination: "/",
      },
    ];
  },
};

module.exports = nextConfig;
