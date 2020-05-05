<h3>GET and POST API</h3>

* Includes data_parser.py to parse through all csv files in ./csv and store them in mysql database.
* GET route fetches contents based on id from database.
* POST route parses csv and stores related data seperately for every user.
* The database consists of three tables: users, user_data, user_all.
    * user_all contains all data from all csv files
    * users contains distinct Id and names
    * user_data contains Id, dates, steps and calories of every user
