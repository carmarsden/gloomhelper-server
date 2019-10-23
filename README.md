# Gloomhelper Server

Server API interface for storing and delivering Gloomhaven party & character data.

## Links

* [App Demo](https://gloomhelper.carmarsden.now.sh)
* [App Documentation](https://github.com/carmarsden/gloomhelper-app)

## Technology

### Built with:
* Node.js
    * Express server framework
    * Jsonwebtoken and bcrypt.js for authentication
    * Morgan and Winston for logging
    * CORS and Helmet for safer request headers
* PostgreSQL database
    * Knex.js for query building
    * Postgrator for versioning
    * XSS for cleaning possible cross-site scripting attacks
* Testing on Mocha framework using Chai and Supertest

## API Documentation

All get requests return JSON response.
All post requests require application/json body, and return JSON response.

### Endpoints for data entries:

**Get By User:** `GET /api/entries`

* Protected endpoint: header must include `Authorization` bearing a valid JWT
* Requests both all party entries and all character entries for the requesting user
    * `user_id` derived from JWT
* Successful get request will return array containing two nested arrays:
    1. Array of JSON objects representing the user's saved parties, each containing the following fields:
        * `id`: integer
        * `user_id`: integer
        * `party_name`: string
        * `location`: string
        * `reputation`: integer from -20 to 20
        * `party_notes`: string
        * `achievements`: string
        * `date_modified`: date
    2. Array of JSON objects representing the user's saved characters, each containing the following fields: 
        * `id`: integer
        * `user_id`: integer
        * `character_name`: string
        * `character_class`: one of the following strings: `brute`, `cragheart`, `mindthief`, `spellweaver`, `scoundrel`, `tinkerer`
        * `xp`: integer, minimum 0
        * `gold_notes`: string
        * `items_notes`: string
        * `character_notes`: string
        * `goals_1` through `goals_6`: integer from 0 to 3
        * `perks`: string, length 15, each character is a 0 or 1 (e.g. `000010000001001`),
        * `date_modified`: date

**Post Party:** `POST /api/entries/parties`

* Protected endpoint: header must include `Authorization` bearing a valid JWT
* Post a single JSON object
    * Post body must minimally contain `party_name` and `reputation` values
    * Default values applied to `date_modified` if not supplied
    * Null value applied to `location`, `party_notes`, and `achievements` if not supplied
    * `user_id` derived from JWT
    * See above "Get By User" section for data type requirements
* Successful post request will return JSON of the posted object

**Post Character:** `POST /api/entries/characters`

* Protected endpoint: header must include `Authorization` bearing a valid JWT
* Post a single JSON object
    * Post body must minimally contain `character_name` and `character_class` values
    * Default values applied to `xp`, `goals_1` through `goals_6`, `perks`, and `date_modified` if not supplied
    * Null value applied to `gold_notes`, `items_notes`, and `character_notes` if not supplied
    * `user_id` derived from JWT
    * See above "Get By User" section for data type requirements
* Successful post request will return JSON of the posted object


### Endpoints for user management:

**Create Account:** `POST /api/users/register`

* Post `{ username, password }` object to create a new user
    * Note: username cannot already exist, must be more than 3 characters, cannot start or end with white space
    * Note: password must be 8 - 72 character and must contain at least one lowercase letter, uppercase letter, number, and special character
* Successful post request will return JSON object containing `id, username, date_created`

**Log in:** `POST /api/users/login`

* Post `{ username, password }` object to log in to the application
* Successful post request will return JWT containing user_id payload