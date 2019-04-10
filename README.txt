Project Report - COMP 3008 A2
Team name: EAT THE COMPUTER

Cedric Knapp - 101038246
Connor MacKenzie - 101023465
Noah Beeney - 101038267
Zachary Stroud-Taylor - 100955368

App run instructions (Locally):

    Node.js required to run server

    Run with "node app.js" for directory containing app.js

    App accessible at: http://localhost:3000

App running remotely (Heroku):

    The application is also running remotely via Heroku

    App accessible at: https://stark-mountain-65813.herokuapp.com

Overview: (All password schema instructions given by app)

    "Done" button checks if password is correct

    "Reset" button erases current password

    Practice:
        Enter the animals sounds in the correct order specified by the account type
        Once all three passwords have been seen in practice mode "Start Test" button will be visible
        Switch account with "Switch Accounts" button to practice other passwords
        "Hint" button shows password again
        Practice as much as you want

    Test:
        Enter password specified by app
        Three attempts max

    Logs:
        Logs of the data gathered from the test once the test is complete are available at:
            Locally: http://localhost:3000/stats.csv
            Heroku: https://stark-mountain-65813.herokuapp.com/stats.csv (The remote logs will expire after the applicaiton goes idle)

Note:

    Reloading page ends session and starts new session in practice mode
