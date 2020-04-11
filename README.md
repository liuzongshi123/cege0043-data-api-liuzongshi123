# Data API

<p align="justify">This is a technical guide for API setting. This part setting the data API for both <strong>Question Setting App</strong> and <strong>Quiz App</strong>, which allow them insert data or get data from database. It also add an https server to serve files to make sure location-based and other functions work correctly on browser.</p>

## Table of Contents
* System Requirements
* Deployment
* Testing
* File description
* Code reference

## 1. System Requirements
* <p align="justify">In order to enable the full functionality of data-API, a browser that supports https connection is required. So most browsers can be used for these two apps. In order to make sure the apps can locate and zoom into user positions, it is recommended to use Chrome(Version 73.0.3683.75 or above) or Safari(Version 13.1 or above).</p>

* <p align="justify">Data-API requires to make connections to a Ubuntu Server (Virtual Machine). You could use BitVise, Pycharm or other SSH software to connect to the Ubuntu Server.</p>

* <p align="justify">If you are going to use this app outside the UCL campus (not connected to Eduroam), make sure you are connected to UCL VPN by following the instructions at https://www.ucl.ac.uk/isd/services/get-connected/remote-working-services/ucl-virtualprivate-network-vpn.</p>

## 2. Deployment
<p align="justify">1. Clone the source code of the corresponding Node JS server from Github to CEGE server at <code>home/studentuser/code</code>.</p>

```javascript
cd /home/studentuser/code
git clone https://github.com/ucl-geospatial/cege0043-data-api-liuzongshi123
```

<p align="justify">2. Go to the <code>cege0043-data-api-liuzongshi123</code> folder and start the Node JS server.</p>

```javascript
cd /home/studentuser/code/cege0043-data-api-liuzongshi123
pm2 start dataAPI.js
```

<p align="justify">3. Make sure the Node JS server is successfully started. If any error occurs, you could enter the debug mode through the command line window by typing:</p>

```javascript
cd /home/studentuser/code/cege0043-data-api-liuzongshi123
node dataAPI.js
```

## 3. Testing
* <p align="justify">Procedures to test dataAPI:</p>

<p align="justify">1. Make sure your device is connected to UCL Wifi or UCL VPN.</p>

<p align="justify">2. Make sure the Node JS server and app server is active.</p>

<p align="justify">3. In a browser that supports https connection, type the following address: https://developer.cege.ucl.ac.uk:30283, make sure you can see "<strong>hello world from the Data API</strong>" printed on the screen.</p>

## 4. File description

<p align="justify">The files associated to <strong>data-API</strong> are located in the <code>cege0043-data-api-liuzongshi123</code> folder and several subfolders.</p>

* **`cege0043-data-api-liuzongshi123`**

<p align="justify"><code>dataAPI.js</code>: The main api file for both <strong>Question Setting App</strong> and <strong>Quiz App</strong>, which allowed all the functionalities work correctly. The main functions of <code>dataAPI.js</code> include:

* <p align="justify">Add an https server to serve files. </p>

* <p align="justify">Add functionality to allow cross-origin queries when PhoneGap is running a server. </p>

* <p align="justify">Add CROS. </p>

* <p align="justify">Add functionality to log the requests. </p>

* <p align="justify">Interconnect to <code>geoJSON.js</code> and <code>crud.js</code>. </p>

<br>
<br>

* **`cege0043-data-api-liuzongshi123/routes`**: Ensure the connection between apps and database

`crud.js`:  Make sure apps can upload data to data base or delete data in databse.

<table align="center">
	<thead align="center"><tr>
		<th>Name</th>
		<th>Description</th>
		</tr></thead>
		<tbody align="center">
			<tr>
			<td><code>crud.post('/insertFormData'...</code></td>
			<td align="center">Get the form data from apps and insert data into database.</td>
			</tr>
			<tr>
			<td><code>crud.post('/deleteFormData'...</code></td>
			<td align="center">Get the question ID form apps and delete question in databse.</td>
			</tr>
			<tr>
			<td><code>crud.post('/insertAnswerData'...</code></td>
			<td align="center">Get the answer data from apps and insert data into database.</td>
			</tr>
			<tr>
			<td><code>crud.post('/deleteAnswerData'...</code></td>
			<td align="center">Get the question ID form apps and delete answer in databse.</td>
			</tr>
	</tbody>
	</table>

<br>

`geoJSON.js`:  Get the data form database and convert them to geoJSON.

<table align="center">
	<thead align="center"><tr>
		<th>Name</th>
		<th>Description</th>
		</tr></thead>
		<tbody align="center">
			<tr>
			<td><code>geoJSON.get('/getGeoJSON/quizquestions/location/:port_id...</code></td>
			<td align="center">Get the port_id as a parameter and get the relative question data in database.</td>
			</tr>
			<tr>
			<td><code>geoJSON.get('/quizanswers/:port_id'...</code></td>
			<td align="center">Get the port_id as a parameter and get the relative answer data in database.</td>
			</tr>
			<tr>
			<td><code>geoJSON.get('/quizanswers/correctnumber/:port_id'...</code></td>
			<td align="center">Get the port_id as a parameter and get the relative correct number of question answered data in database</td>
			</tr>
			<tr>
			<td><code>geoJSON.get('/quizanswers/ranking/:port_id'...</code></td>
			<td align="center">Get the port_id as a parameter and get the relative ranking answered data in database.</td>
			</tr>
			<tr>
			<td><code>geoJSON.get('/topscorers'...</code></td>
			<td align="center">Get the topscorers data in database.</td>
			</tr>
			<tr>
			<td><code>geoJSON.get('/quizanswers/participationrate/my/:port_id'...</code></td>
			<td align="center">Get the port_id as a parameter and get the relative participation rate data for current user in database.</td>
			</tr>
			<tr>
			<td><code>geoJSON.get('/quizanswers/participationrate/all'...</code></td>
			<td align="center">Get the participation rate data for all users in database.</td>
			</tr>
			<tr>
			<td><code>geoJSON.get('/questionAdded/Lastweek'...</code></td>
			<td align="center">Get the question added last week data for all users in database.</td>
			</tr>
			<tr>
			<td><code>geoJSON.post('/FiveClosestPoint'...</code></td>
			<td align="center">Get the current user's location from apps and get the five closest point data for all users in database.</td>
			</tr>
			<tr>
			<td><code>geoJSON.get('/FiveDifficultPoint'...</code></td>
			<td align="center">Get the five difficult questions data for all users in database.</td>
			</tr>
			<tr>
			<td><code>geoJSON.get('/LastFiveQuestionsAnsewred/:port_id'...</code></td>
			<td align="center">Get the port_id as a parameter and get the last 5 questions that the current user answered in database.</td>
			</tr>
			<tr>
			<td><code>geoJSON.get('/AnsweredWrong/:port_id'...</code></td>
			<td align="center">Get the port_id as a parameter and get the questions that the user hasn’t answered correctly in database.</td>
			</tr>
	</tbody>
	</table>

## 5. Code reference

* <p align="justify">A large proportion of codes are adapted from the lab notes of <strong>CEGE 0043 Web Mobile and GIS by Calire Ellul</strong>, including all the functions in <code>dataAPI.js</code>, and SQL query in <code>geoJSON.js</code> and <code>crud.js</code>.</p>
