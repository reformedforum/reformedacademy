Reformed Academy
======

Reformed Academy is a free and open learning experience.
Reformed Academy is a project of Reformed Forum, a 501(c)(3) organization.

License Information
---------------------------
Reformed Academy is licensed under GPLv3. You are free to modify the source code and
use it in your own project, however you must also adopt GPLv3. Reformed Academy is a free and open
learning experience, and we believe the software should coincide with these values.

NOTICE: ALL COURSE CONTENT ON THE REFORMED ACADEMY WEBSITE AND THE REFORMED ACADEMY LOGO ARE
PROPERTY OF REFORMED FORUM AND DO NOT FALL UNDER GPLV3. THE REFORMED ACADEMY LOGO MUST BE 
REPLACED WHEN DISTRIBUTING REFORMED ACADEMY.

Project Notes
---------------------------
The following directions are specfic to Mac OSX. If you would like to contribute by providing instructions for other platforms, it would be greatly appreciated!

Check out the project
---------------------------

    git clone --recursive git@github.com:reformedforum/reformedacademy.git

Setting up project requirements
-------------------------------

###Install Homebrew

    ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)”

###Make sure Homebrew is configured properly

    brew doctor

Fix any errors if need be.

###Install Python and MySQL (if necessary)

    brew install python
    brew install mysql

###Create a MySQL database 'academy'

For a fresh MySQL install run the commands below. Otherwise ignore the commands below and just create an 'academy' database.

    mysql.server start

If MySQL doesn't start for you, give this a try: http://stackoverflow.com/a/11061487

    mysql -u root
    mysql> create database academy;
    mysql> quit

###Modify the local_settings file to work with your MySQL installation

    cd /path/to/project/directory
    mv reformedacademy/local_settings.py.example reformedacademy/local_settings.py

Updated local_settings.py.

###Create and activate a virtual environment

    pip install virtualenv
    virtualenv env
    . env/bin/activate

###Install project dependencies

    pip install -r requirements.txt

###Sync the database

    ./local.sh migrate

###Run the local web server

    ./local.sh runserver

###Post installation instructions

After everything is set up, all that needs to be done is run runserver.sh

    cd /path/to/project/directory
    ./local.sh runserver

If there are database changes after you pull the latest from the repo you'll have to perform a database migration.

    ./manage.py migrate --settings=reformedacademy.local_settings

If you make a model change, be sure to run the commands below, otherwise production will not be updated.

    ./manage.py makemigrations --settings=reformedacademy.local_settings
    ./manage.py migrate --settings=reformedacademy.local_settings

Scripts
-------------------------------

* local.sh - Runs manage.py commands using local settings. (e.g. ./local.sh runserver
