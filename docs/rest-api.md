**Base Url**
----
  http://3.213.157.50
  
## **List Police Officers**
  Returns json data about police officers.

* **URL**

  /api/police

* **Method:**

  `GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
      {"data": [{
        "id": 1,
        "fullName": "Mountain",
        "caseId": null
      }]}


## **Create Police Officer**
   Hire police officer
   
* **URL**
  
  /api/police
  
* **Method:**

  `POST`

* **Data Params**

  **Required:**
  
  `fullName=[string]` - full name of the officer
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
      {"data": [{
        "id": 1,
        "fullName": "fullName",
        "caseId": null 
      }]}
    ```
 
* **Error Response:**

 * **Code:** 400 BAD REQUEST <br />
   **Content:** `{ error : "Not valid body" }`


## **Remove Police Officer**
  
  Fire police officer
  
* **URL**
  
  /api/police
  
* **Method:**

  `DELETE`
  
* **URL Params** 

  **Required:**
  
  `id=[number]` - id of police officer

* **Success Response:**

  * **Code:** 204 <br />
    **Content:** None
    
* **Error Response:**

 * **Code:** 400 BAD REQUEST <br />
   **Content:** `{ error : "Police officer has a case: [NUMBER]" }`

   OR
 
 * **Code:** 404 NOT FOUND <br />
   **Content:** record not found

**Show Cases**
----
  Returns json data about cases.

* **URL**

  /api/case

* **Method:**

  `GET`

* **Query Params**
  
  **Optional:**

  `type=[enum]` -  values: `'Mountain', 'Hybrid', 'Road', 'TimeTrial', 'BMX', 'Commuting', 'Cyclocross', 'Track', 'Tandem', 'Folding', 'Kids', 'BeachCruiser', 'Recumbent'` \
  `ownerName=[string]` \
  `color=[string]` \
  `resolved=[boolean]` \
  `policeId=[number]` - or empty value for get unassigned cases\

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
      {"data": [{
        "id": 1,
        "type": "Mountain",
        "ownerName": "John Doe",
        "licenseNumber": "123abc456",
        "color": "black",
        "theftDescription": "Some description",
        "date": "2019-05-27T00:00:00.000Z",
        "resolved": false,
        "createdAt": "2019-05-27T11:27:55.653Z",
        "updatedAt": "2019-05-27T11:27:55.673Z",
        "policeOfficerName": null
      }]}
    ```


## **Create Case**
   
  Create a case
  
* **URL**
  
  /api/case
  
* **Method:**

  `POST`

* **Data Params**

  **Required:**
  
  `type=[enum]` -  values: `'Mountain', 'Hybrid', 'Road', 'TimeTrial', 'BMX', 'Commuting', 'Cyclocross', 'Track', 'Tandem', 'Folding', 'Kids', 'BeachCruiser', 'Recumbent'` \
  `ownerName=[string]` \
  `color=[string]` \
  `licenseNumber=[boolean]` \
  `date=[date]` \
  `theftDescription=[string]` 
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
    {
      "data": {
        "id": 1,
        "type": "Mountain",
        "ownerName": "John Doe",
        "licenseNumber": "123abc456",
        "color": "black",
        "theftDescription": "Some description",
        "date": "2019-05-27T00:00:00.000Z",
        "resolved": false,
        "createdAt": "2019-05-27T11:27:55.653Z",
        "updatedAt": "2019-05-27T11:27:55.653Z",
        "policeOfficerName": null
      }
    }
    ```

* **Error Response:**

 * **Code:** 400 BAD REQUEST <br />
   **Content:** `{ error : "Validation message" }`

## **Resolve Case**
   Resolve a case
  
* **URL**
  
  /api/case
  
* **Method:**

  `PUT`
  
* **URL Params** 

  **Required:**

  `id=[number]` - case number

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
    {
      "data": {
        "id": 1,
        "type": "Mountain",
        "ownerName": "John Doe",
        "licenseNumber": "123abc456",
        "color": "black",
        "theftDescription": "Some description",
        "date": "2019-05-27T00:00:00.000Z",
    
        "resolved": true,
    
        "createdAt": "2019-05-27T11:27:55.653Z",
        "updatedAt": "2019-05-27T11:27:55.653Z",
        "policeOfficerName": null
      }
    }
    ```

* **Error Response:**

 * **Code:** 400 BAD REQUEST <br />
   **Content:** `{ error : "Validation message" }`
   
   OR
   
 * **Code:** 400 BAD REQUEST <br />
   **Content:** `{ error : "Could not resolve case without police officer" }`
   
   OR
   
 * **Code:** 404 NOT FOUND <br />
   **Content:** `{ error : "Not found" }`
