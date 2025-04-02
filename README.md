# Local/Global Taste (To be changed later)

// This file I created is for LLM to better assist our project development with better understandings of our project.

Dine with Locals is a web application that connects travelers and short-term residents with local hosts across North America, offering authentic culinary experiences and fostering cultural exchange. Users can match with locals for authentic dining experiences, and communicate directly with hosts through integrated chat and call features, and restaurant browsing. The platform also includes community engagement tools such as real-time blogs, ratings, and reviews to build trust and enrich the user experience.

# Features

1. Login (both hosts and users)

- Users click on “Login” on the Landing page.
- User must enter their phone number and password on the Login page
- Login using a Google account

2. Sign-up (both hosts and users)

- Users click on “Create a new account” on the Login page.
- Users must enter their personal phone number
- Users enter the OTP sent to their phone number
- Users have to fill in the following fields:
- Required fields: first name, last name, dob, gender, password, role (host or regular user)
- Optional fields: hobbies, preferences with host/user (gender, ethnicity, number of people per event, cuisine, food restrictions, etc)

3. [Host] Create a new listing

- Host clicks “Create a new listing” on the Dashboard.
- Location Selection: Host/ Regular users can indicate location preference in their listings

Required input fields:

- Listing title
- Location: a restaurant or host’s residence.
  (If selected restaurant) Restaurant suggestion list/map with filters for:
  Distance
  Price Range
  Dietary Restrictions
  Time and Date
  Maximum total number of people
  Dietary accommodation availability (e.g. can accommodate gluten-free, vegan, vegetarian, etc.)
  Payment type: split the bill/host pays/regular user pays/open for discussion
  Topics available to discuss, topics to avoid
  (Optional): Field of work, hobby, ethnicity, etc.

4. [USER] Create a new request to be hosted

- User clicks “Create a new request” on the Dashboard.
  Required input fields:
- Request title
- Location: a specific area (e.g. part of town)
- Time and Date
- Total number of people
- Dietary restrictions (e.g. certain allergies, vegan, vegetarian, etc.)
- Topics to avoid/ talk about
  (Optional) Field of work, hobby, ethnicity, etc.

5. In-app Chat & Video Calls between hosts and users

- User clicks on the Chat tab on the Navigation Bar of the Dashboard
- The chat tab shows the available contacts
- User clicks on the contact to start a chat
- User clicks on the call button after clicking on the contact to make a call

6. Social Tab: Users and Hosts can share their experiences on a feed/their profile, with upvote and downvote button

- Create new posts:
  App users can make a post/blog with texts, photos, and videos, and able to tag the location.
  Each post has upvotes, downvotes, and comments.
- Social Feed:
  App users can browse and scroll for posts.
  Filters like “most recent” and “hot” (based on upvotes) can be applied.
  (Stretch) If a location is tagged, clicking on the location reveals the location on a map with all related posts/ reviews.
  (Stretch) App users can add others as “friends”
- The visibility of the posts can be limited to Friends or Public
- If a user is a “friend” of another user, the visibility of the posts on their profile and on the Social Feed changes accordingly.

7. Reviews of Hosts/Users: On their profile page, there should be a section where hosts and regular users leave reviews and ratings (1–5 stars) about each other

- Reviews can be classified as “good”,"bad”, or “neutral” using an AI sentiment analysis model
- Visibility of hosts/users when recommended on listing board is determined by the ratings
