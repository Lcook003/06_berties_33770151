# Berties Books (06_berties_33770151)

A small demo app for Labs 6, 7 & 8.

Authorisation (Lab 8a)

Sessions implemented using express-session

Protected routes:

/books/list

/users/list

/users/audit

Access requires login; otherwise user is redirected to /users/login

Logout implemented using req.session.destroy()

Validation (Lab 8b)

Email validated with isEmail()

Username validated with isLength({min:5,max:20})

Password validated with isLength({min:8})

Errors cause the register form to reload

Sanitisation (Lab 8b/c)

First name, last name, email, username, and password sanitised using req.sanitize()

Protects against XSS

Demonstrated vulnerability with Henry <script>alert("Gotcha!")</script>

Weather API (Lab 9a)
	•	/weather form
	•	/weather/now?city=London
	•	Uses OpenWeatherMap API
	•	Handles errors safely
	•	Displays temp, humidity, wind

Books API (Lab 9b)
	•	/api/books JSON endpoint
	•	Supports:
	•	search (keyword)
	•	minprice, maxprice
	•	sort=name|price

Deployment
	•	Running on VM with forever
	•	links.txt contains single required line
