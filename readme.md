## MEXN template

Welcome to this template. After recreating this setup dozens of times I decided to make a public template of it.
This template contains a client (as Vuejs, React or Angular), a server (as ExpressJS or NestJS) and a database (as MongoDB).

This all bootstrapped together with docker compose to run it within containers.

And finally a template for using github actions to deploy.

For using this template knowledge is needed on how to use:

-   Docker
-   NodeJS
-   NPM
-   NGINX
-   MongoDB

To download
`git clone https://github.com/thebetar/MEXN-template.git`

### Instructions

To start this project run `npm run init`. This will present some questions about which `client`, `server` and `database` you choose.

For the `client` and `server` respectively there are readme's inside the directory. Read those for the setup concerning those parts
(to run in development there is also a small readme in the `db` folder).

Further more generate a random string for the JWT_SECRET (I prefer using the devtoys extension for VSCODE).

Within your own github repository add the secrets referred to in the `.github/workflows/deploy.yml` (see https://github.com/Azure/actions-workflow-samples/blob/master/assets/create-secrets-for-GitHub-workflows.md for reference how to do this).

#### Running in development

A small note for running in development. Docker compose is used to ship to development, we do not want to use this to run within development otherwise we lose the sweet features of fast hot reloading. Within the docs for the `client` and `server` you will find how to run these locally but to run the database see the readme within the `db` folder.

From here on out you are on your own happy programming!
