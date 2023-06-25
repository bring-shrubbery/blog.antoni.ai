import blog, { ga } from "https://deno.land/x/blog@0.6.1/blog.tsx";

blog({
  title: "Antoni",
  author: "Antoni",
  avatar: "./snoop.jpg",
  avatarClass: "full",
  links: [
    { title: "Email", url: "mailto:antoni@quassum.com" },
    { title: "GitHub", url: "https://github.com/bring-shrubbery" },
  ],
  lang: "en",
  middlewares: [ga("G-C0SCBZQ6ME")],
});
