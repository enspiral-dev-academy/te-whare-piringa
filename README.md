# Te Whare Piringa Booking System

[Te Whare Piringa](http://tewharepiringa.nz) is a community hall. This application provides a way for the community to see when the hall is available for functions and to request times to use the hall. This promotes transparency, enables the community to get the most from the hall, reduces errors such as double-booking, and saves the administrators a lot of time and energy while managing the use of the hall.


## Dev Environment Setup

1. Clone the repo and install the node modules with `npm install`.

1. Be sure you have Docker and Docker Compose installed.

1. Rename `.env.example` to `.env` and edit it to have the correct values.

1. Start the MongoDB database using `npm run db:start` and use `npm run db:stop` to stop the database. These commands must be run in the terminal from the project's root folder.

1. Create the database and add admin and test user accounts by running `npm run db:init`.

After the images are downloaded (first time only) and the services are running, the Mongo Express admin interface can be found on [http://localhost:8088](http://localhost:8088) if you want to view/edit the data in the database. The username is `admin` and the password is `pass`.

If you want to add some example bookings, run `npm run db:seed` in your terminal from the root of the project. This will create 3 bookings from 8am to 6pm:

* An unconfirmed one for today
* A confirmed one for tomorrow
* A confirmed one for yesterday

Run the app with `npm run dev` and it will be running on [http://localhost:3000](http://localhost:3000).


## Deployment

Run this script to create environment variables: `npm run deploy-env-vars`

The application is hosted on Heroku at https://tewharepiringa.herokuapp.com.

The application is deployed every time code is pushed to the `master` branch.

_more forthcoming..._


## Tools, accounts and other implementation details

@donsmith currently has access to all of these accounts and can add others as needed.

* **Domain name**: tewharepiringa.nz is registered with crazydomains.co.nz, but the name servers point to Don's dnsimple.com account where the `ALIAS`, `CNAME`, `TXT`, `SOA` and `MX` records are managed.

* **Web application**: The app is hosted on Jack's Heroku account and the rest of the team have been added as collaborators on the `thebookingmanager` app.

* **Database**: The MongoDB database is hosted on mlab.com, but created and managed through Heroku. The mLab service is a free add-on to the application on Heroku.

* **Email**: The mailgun.com service is used to programmatically send various email messages from the booking application to the people booking the community hall. The configuration of that service is also how we direct all email messages sent to tewharepiringa.nz to DJ's GMail account.

* **Authentication**: We use auth0.com to manage authentication and users. When users register, we first direct them to Auth0 before we have them complete their registration on the tewharepiringa.nz web site. The Auth0 registration creates an Auth0 user account in our tewharepiringa app in Auth0. These user accounts each have a `user_id` that we store in the `users` collection in the MongoDB database when the user completes their registration on the tewharepiringa.nz web site.

* **Configuration**: Two files are used to store configuration information: `shared/config.js` and `shared/vars.js`. `config.js` is used for values that we don't expect will change often and are not specific to an environment. `vars.js` exposes environment variables defined either as "config vars" on Heroku or defined in the `.env` file.
