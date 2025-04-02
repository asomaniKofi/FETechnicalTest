# Frontend Tech Test

Build a simple yet functional web application that allows users to view and search through a list of video contributions. The application should demonstrate your ability to create a responsive, user-friendly interface and integrate with a backend service.

## Setup

After pulling down the Repo Please run `npm i --save --legacy-peer-deps` in the ui folder after starting up the python server
All the individual commands are explained in the `ui/package.json` file

## Completed Tasks

Built a homepage that should show a list of contributions, retrieved from the provided backend API.

- For each contribution show its:
  - Title
  - Description
  - Start time; displaying the date and time in the users locale
  - End time; displaying the date and time in the users locale
  - Owner (the producer of the contribution)
  - Status; is the contribution `Complete` (in the past), `Active` (currently being aired) or `Scheduled` (in the future)
- Shows 14 contributions at once
- The contributions list should show with:
  - 3 contributions per row on desktop
  - 2 contributions per row on tablet
  - 1 contributions per row on mobile
- A working search bar at the top, that filters contributions by title
- Added pagination
-  Upgrade the search functionality so that you can filter by more than just title.
-  Unit Tests

Include a README file with instructions on how to run the project and any other relevant information.
