# Express Boilerplate!

This is a boilerplate project used for starting new projects! Created with guidance from Bloc/Thinkful curriculum.
This project creates an Express server equipped with appropriate middleware & testing libraries, which is built to interface with PostgreSQL database including SQL query building and database migrations.

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`
6. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
7. Edit `.env` file with true environment variables. Edit `config.js` DB_NAME to your database name and username.
8. Create migrations folder for postgrator `mkdir migrations`

## Scripts

- Start the application: `npm start`
- Start nodemon for the application: `npm run dev`
- Run tests: `npm test` or `npm t`
- Run tests in watch mode: `npm run test:watch`
- Migrate local database: `npm run migrate`


## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku".

Check `postgrator-production-config.js` file to update production database variables.

Run `npm run deploy` which will do an NPM audit, migrate the production database, and push to this remote's master branch.