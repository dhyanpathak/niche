# niche
[Check it out](https://niche-staging.herokuapp.com/)


![screencap](https://github.com/dhyanpathak/niche/blob/master/demo-gif.gif?raw=true)

Allows you to discover new clothing brands of your particular taste. 
This is a React/Redux on Rails mobile-friendly web app. 
Store data comes from user inputted links of Shopify stores and information is retrieved from `products.json` page.

This app has the following functionality and features:
* authentication and login persistence

* Spotlight page - shows you recent, trending posts

* For You page - shows you recommended posts based off the tags of posts you've liked before or posted

* Add Store page - given a Shopify link and tags describing the style of the shop, a store will be created along with each product becoming a new post
  * You can test the Add Store page with these two stores I haven't added yet:
    * `https://bekindrewind.shop/` with tags like `[vintage, sustainability, 80s, social]`
    * `https://www.staycoolnyc.com/` with tags like `[retro, cool, colorful]`

* Search page - search posts, users, stores

* Likes page

* User page/User post

Stuff that I have left to do is:

~~* Add Redux to better manage state and transfer data seamlessly through components (currently you have to refresh to load newly added store, switch tabs to load more posts in Spotlight)~~

* Turn the RESTful API into GraphQL

* Implement Follow/Following features between users

* Add BigCartel stores in the Add Store page as well

* Closet page where users can posts their outfits and better organize what they wear

* Update user account with a personalized page so people can add avatars and bios etc.

* Include style tags in the search feature so users can find stores/clothes/users of a particular style (and even a set of styles)

* Add a Lookbook in the form of stories on the User page (users can create Lookbook for types of styles)

Redux is used for managing state containing likes, curated and spotlight feeds. The user posts are stored in Google Cloud Storage and the database of choice is Postgres considering its ease in quick deployments to Heroku. A SQL database was chosen for its lack of redundancy with normalization, fast speeds in retrieval, ACID compliant standards to uphold stability. 
Given how this project may evolve and buzzwordy concepts might get thrown at it (like using machine learning for curation), a NoSQL db would be considered for its capability in handling big data, being flexible with various data models and low cost scalability. 

