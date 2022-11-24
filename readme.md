## MEXN template

Welcome to this template. After recreating this setup dozens of times I decided to make a public template of it.
This template contains a client (as Vuejs, React or Angular), a server (as ExpressJS or NestJS) and a database (as MongoDB).

This all bootstrapped together with docker compose to run it within containers.

And finally a template for using github actions to deploy

For using this template knowledge is needed on how to use:

-   Docker
-   NodeJS
-   NPM
-   NGINX
-   MongoDB

### Instructions

For the `client` and `server` respectively there are readme's inside the directory. Read those for the setup concerning those parts.
(to run in development there is also a small readme in the `db` folder)

For docker compose some setting up has to be done as well. Change within the `docker-compose.yml` file the `project-name` string to your project name.
Further more generate a random string for the JWT_SECRET (I prefer using the devtoys extension for VSCODE).

Within the `./github/worksflows/deploy.yml` folder you see some secret and another `ProjectName`. Change this `ProjectName` to your project name and within your own github repository add the secrets (see https://github.com/Azure/actions-workflow-samples/blob/master/assets/create-secrets-for-GitHub-workflows.md for reference how to do this).

#### Running in development

A small note for running in development. Docker compose is used to ship to development, we do not want to use this to run within development otherwise we lose the sweet features of fast hot reloading. Within the docs for the `client` and `server` you will find how to run these locally but to run the database see the readme within the `db` folder.

From here on out you are on your own happy programming!
