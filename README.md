# grnfld

A Hack Reactor forum for code review and troubleshooting, built with Stack Overflow in mind. 
Register to post your questions, comment, mark solutions, and assign HackCoins to quality responses.<br><br>
Brought to you by Da Brain Trust LLC/LTD/GmbH

<h4>To run the server use:</h4>
1. install depedencies
2. npm run server-dev

<h4>Notes</h4>
There are two schemas available to use. Local database for testing is MySQL with a PostgreSQL database for heroku deployment.
<br>
<br>
The navbar and posts are two seperate components as can be seen in the app.html. 
<br>
<br>
Services are specifically used for requests to the server.
<br>
<br>
Bootstrap utilities are pulled from CDNs. on the index.html page



<h4>Stretch goals:</h4>
1. Scoring system for users <br>
  a. 1 like = 1 extra hackcoin<br>
  b. 1 like = permanent points for user profile
2. Anonymous posting<br>
  a. create new usernames for every post
3. Search<br>
  a. posts have tags to search by
4. Child comments (reddit style)
5. Closed flag
6. Oauth
7. Sessions for persistent login
8. Refactor to async/await in server calls
9. create modals for using multiple hackcoins (ng-doubleclick)
10. Comment order<br>
  a. order by number of likes
11. Delete posts and comments
12. footer and IP information<br>
  a. privacy statement<br>
  b. contact information<br>
  c. careers
13. Profile page
14. multi-line code formatting in comments
15. prettify codebox with syntax highlighting
16. create unique URL to share direct links to posts
