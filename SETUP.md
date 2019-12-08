# How to setup a new booking platform

> Very early work in progress

1. Set up local environment variables

    ```
    cp .env.example .env
    ```

  - Open `.env` and edit the values appropriately
    - # TODO: Add specifics
  - Open `shared/config.js` and edit the values appropriately
    - # TODO: Add specifics

1. Install Heroku CLI tool

    - Linux: `sudo snap install heroku --classic` (requires [Snap](https://snapcraft.io))
    - MacOS: `brew install heroku/brew/heroku` (requires [Homebrew](https://brew.sh))
    - Windows: `choco install heroku-cli` (requires [Chocolatey](https://chocolatey.org))

  For more information see the [Heroku setup documentation](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up).

1. `heroku login`

1. Deploy environment variables to production

    `npm run deploy-env-vars`

1. Configure the production database

    `npm run db:init:prod`
