export const seoConfig = {
  defaultTitle: "ThisKidCanCode - Free Coding Education for Kids Ages 11-18",
  titleTemplate: "%s | ThisKidCanCode",
  defaultDescription: "100% free coding platform teaching kids HTML, CSS, and JavaScript through gamified adventures. 5,000+ students trained since 2013. Professional GitHub tools for real-world skills.",
  siteUrl: "https://thiskidcancode.com",
  siteName: "ThisKidCanCode",
  images: {
    default: "/tkccFbLogo.png",
  },
  keywords: [
    "coding for kids",
    "free programming education", 
    "HTML CSS JavaScript",
    "GitHub for students",
    "computer science education",
    "coding bootcamp kids",
    "learn to code free",
    "programming for teens",
    "STEM education",
    "web development kids"
  ],
};

export function generatePageMetadata(
  title?: string,
  description?: string,
  path?: string,
  image?: string
) {
  return {
    title: title || seoConfig.defaultTitle,
    description: description || seoConfig.defaultDescription,
    openGraph: {
      title: title || seoConfig.defaultTitle,
      description: description || seoConfig.defaultDescription,
      url: path ? `${seoConfig.siteUrl}${path}` : seoConfig.siteUrl,
      images: [image || seoConfig.images.default],
    },
    twitter: {
      title: title || seoConfig.defaultTitle,
      description: description || seoConfig.defaultDescription,
      images: [image || seoConfig.images.default],
    },
    alternates: {
      canonical: path ? `${seoConfig.siteUrl}${path}` : seoConfig.siteUrl,
    },
  };
}