export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "FarNotify",
  description:
    "Get hourly notifications about trending mints among Farcaster users and view trending casts directly on MetaMask.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/MetaMaskDev",
    github: "https://github.com/heynish/farnotify-snap",
    docs: "https://docs.metamask.io/snaps/",
  },
}
