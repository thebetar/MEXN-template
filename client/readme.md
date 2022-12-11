## Instructions

Here goes your frontend application. Advised is to use `Vue`, `React` or `Angular`

-   Vue: `vue create .` (https://cli.vuejs.org/guide/creating-a-project.html)
-   React: `create-react-app . --template typescript` (https://reactjs.org/docs/create-a-new-react-app.html)
-   Angular: `ng new .` (https://angular.io/tutorial/toh-pt0)

For component frameworks I like to use `material design` for it's very complete components and not having to think about design myself for a more custom design I always use `Tailwind`

Material design libraries I use:

-   Vue: `Vuetify`
-   React: `Mui`
-   Angular: `Angular material`

In the `dockerfile` change `/app/dist` to `/app/build` if the framework of your choice builds to a `build` dist.

Also in the `nginx.conf` change `project-name` to your chosen project name.

### Documentation:

-   Vue: https://vuejs.org/
-   Vuetify: https://vuetifyjs.com/en/

-   React: https://reactjs.org/
-   Mui: https://mui.com/

-   Angular: https://angular.io/
-   Angular material: https://material.angular.io/

-   Tailwind: https://tailwindcss.com/
