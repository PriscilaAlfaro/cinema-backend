[![Actions Status](https://github.com/PriscilaAlfaro/cinema-backend/workflows/cinema-backend-build/badge.svg)](https://github.com/PriscilaAlfaro/cinema-backend/actions)

# Cinema CR

# backend
Install dependencies `npm install`
Starts with `npm run dev`
Runs on Port 4001

# LocationsRouter

1. Create (new location)
   Route: POST '/locations'
   Request Body: {location: string, place: string, mapUrl: string, 
   price: number, totalSeats: number, salong: number}

2. Read (all locations)
   Route: GET '/locations'

# MoviesRouter

1. Create (new movie)
   Route: POST '/movies'
   Request Body: {title: string, director: string, actors: string,
    rated: object with {sv, es}, duration: string, minimunAge: number, poster: string,
    video: string, image: string, description: object with {sv, es} }

2. Read (all movies)
   Route: GET '/movies'


# OrderRouter

1. Create (new order)
   Route: POST '/order'
   Request Body: { name: string,
    email: string,
    location_id: ObjectId,
    location: string,
    place: string,
    salong: string,
    movie_id: ObjectId,
    movie: string,
    date_id: ObjectId,
    date: string,
    screening_id: ObjectId,
    screening: string,
    price: number,
    totalPrice: number,
    seatNumber: [ number],
    paymentReference: string,
    paymentStatus: string,
    purchaseDate: Date,
    availability_id: ObjectId, 
    language: string}

2. Read ( get order by Id)
   Route: GET '/order/:orderId'

3. Update (order by sessionId of Stripe)
   Route: PATCH '/order/:sessionId'
   Request Body: {newPaymentStatus: string}

4. Delete (order by sessionId of Stripe)
   Route: DELETE '/order/:sessionId'

# ScreeningsRouter

1. Create (new screening)
   Route: POST '/screenings'
   Request Body: {movie_id: ObjectId, location_id: ObjectId, 
   dates: [date: Date, 
           screening: [{hour: string}]  ] }
2. Read (all screenings )
   Route: GET '/screenings'
 

# seatAvailabilityRouter

1. Read (get seat availability by screening Id)
   Route: GET '/seatAvailability/:screeningId'


## Seed Database with data

In the seed-db folder you will find the import script and a folder named `data`, with all the folders related with locations, movies, screenings and seat availability that will be saved in db. Every time you run this file, this specific collections of data will be drop and created again.

To insert/update all data in database:

1. npm install
2. npm run seedDb

# Google Cloud Storage(GCS) Setup
Google Cloud Storage(GCS) is a RESTful online file storage web service for storing and accessing data on Google Cloud Platform infrastructure.

######Setup

1. Follow link (https://cloud.google.com/storage/docs/introduction) to set up a GCS account.
2. npm i @google-cloud/storage
3. Create a GCP account and enable GCS.
4. Create a project, service account and Bucket.
5. Provide GOOGLE_CLOUD_BUCKET, GOOGLE_CLOUD_PROJECT_ID,GOOGLE_CLOUD_CLIENT_EMAIL and GOOGLE_CLOUD_PRIVATE_KEY in `.env` file.


## Tech

We are using a number of open source tools:

- [Express] - A JavaScript library for building user interfaces.
- [Sengrid] - A cloud-based email delivery platform.
- [Stripe-testmode] - A payment platform to accept and process payments online.


# Cinema backend

##Setup  

1. `npm install`
2. Create `.env` file in the project directory `.env` and add SENDGRID_API_KEY, STRIPE_API_KEY, STRIPE_SECRET_KEY, MONGO_URI.
4. Create `.env.test` file in the project directory and add MONGO_URI
3. Use MongoDB database to store data.


####MongoSetup  

- Follow the [MongoDB Atlas registration link](https://www.mongodb.com/cloud/atlas/register).
- Fill all mandatory fields and click create account button.
- Choose "Starter Cluster" option and click Create a cluster.
- The next screen choose: cloud provider, region and click "Create Cluster" button.
- Click Security - Database access tab.
- Click Add new user button.
- Choose method - Password and fill the username and the password fields (remember them, you will use them to connect mongodb database).
- User Privileges - Set read and write to any database.
- Click "Add user" button.
- Click Security - Network Access tab.
- Click "Add IP Address" button.
- Click "Allow access from anywhere" button.
- Click "Confirm" button.
- Generate the connect string, by the following: in Atlas - Clusters tab click "Connect" button.
- On Modal window (Connect to Cluster) click "Connect your Application" button: Copy the connection string.
- Replace username,password and dbname in the connection string.

`.env` MONGO_URI='mongodb+srv://USERNAME:YOURPASSWORD@cluster.i3dl2.mongodb.net/YOURDBNAME?retryWrites=true&w=majority' or local connection: MONGO_URI="mongodb://localhost/DEV-PROJECT"

 `.env.test` The database must have a different name than in step before. See below examples.
   Atlas example: MONGO_URI='mongodb+srv://USERNAME:YOURPASSWORD@cluster.i3dl2.mongodb.net/TEST-PROJECT?retryWrites=true&w=majority'  
   Or local connection example: MONGO_URI="mongodb://localhost/TEST-PROJECT"


####Coverage

run `npm run coverage` to see the code that is not covered by a test

####Test

run `npm run test` to see the test result

####Eslint
Eslint must be installed globally: `npm install -g eslint`
run `npm run lint` to check errors