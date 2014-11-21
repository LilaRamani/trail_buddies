Taylor:
- I modified main.js so that when it is checking that all fields have been populated, it also checks that
  the date that was input is of a proper date format. If it is, it converts that date into a new date object
  (which we can store into the database in this format). In the case that it is not in the proper date format
  (DD/MM/YYYY) then it will print an error message saying "Please specif a date in the following format: DD/MM/YYYY".
  If there are other fields that have still been left blank, then this error will display in addition to the
  "One or more fields are blank" error message that displays on the screen.
- Next Steps: In the future, this will be useful for website scraping. Weather websites usually are capable
  of showing a ten-day forecase. So, Using this date format, we can check if the date is within 10 days from now,
  and in the case that it is, we can automatically use website scraping to find and store the weather data for that 
  hike.
