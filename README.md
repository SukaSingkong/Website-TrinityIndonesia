# Pearl Theme Minecraft Server Homepage

Welcome! If you've bought a website from BBB before you are probably pretty confused as to why there are so many files and weird folders. Don't worry, this is normal. 

We've built this website with Next.js and TailwindCSS to make page loads near instant and to be able to take advantage of React's JSX.

What this means for you is that even if you have no experience working with Next.js or React you should be able to get up and running in no time. Though, we do still expect that you know your way around HTML templates.

## Development

First, to be able to see changes as you make them, run the development server:

```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Start editing from the `pages` or `components` directory and see your changes apply in real-time as you save. 

## The configuration file

In `theme.config.js` you will find several options with comments explaining them for editing the basics of the site. This includes the server IP address and the metatags that give your site fancy embeds on Discord and other social media platforms.

## /components/layout/Wrapper.jsx

In here you will find the markup and styles for the navbar and footer. You can go here to set your server's name or replace the text-only "logo" with an image. You can also go here to change the copyright notice & e.t.c.

## /pages/index.js

This is your frontpage. If you want to change the hero section and/or modify the staff list you can do that here.

## /pages/staff.js

This is the staff page. You should edit this page as well to match the homepage if you make any changes to the staff list.

## /pages/rules.js

This is your rules page. Edit the JavaScript array at the top of the file to add or remove rules. They'll be automatically added to the list of rules with a unique number.

## Learn More

To learn more about Next.js & TailwindCSS, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [TailwindCSS Documentation](https://tailwindcss.com/) - explore TailwindCSS's documentation

## Deployment

If you don't know how to deploy your site, you can take advantage of the following static page hosting services to take care of that for you:

- Cloudflare Pages
- Netlify

If you prefer running this on your own server you can run `yarn build` and then `yarn server` to build and serve the site on port 3000. You can then easily run this behind an nginx proxy for production.

## License

This codebase is (c) 2022 Northlayer ehf. By purchasing this template you are granted access to modify and use it for your project/business/etc. You are forbidden from redistributing this template.