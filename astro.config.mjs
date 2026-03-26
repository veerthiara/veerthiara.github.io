import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://veerthiara.github.io",
  integrations: [
    starlight({
      title: "Veer Thiara",
      description: "Developer portfolio, project docs, and engineering notes.",
      tagline: "Engineering portal",
      social: [
        {
          icon: "linkedin",
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/veerthiara/"
        }
      ],
      sidebar: [
        {
          label: "Projects",
          autogenerate: { directory: "projects" }
        },
        {
          label: "Blog",
          autogenerate: { directory: "blog" }
        }
      ],
      customCss: ["./src/styles/global.css"],
      credits: false,
      disable404Route: true
    })
  ]
});
