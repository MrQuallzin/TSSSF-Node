Node TSSSF thing

# Acknowledgments
Majority of art work for the original cards by Pixel Prism
Original Game by Horrible People
Card list shamelessly taken from tsssf.cards
Art for the testing set taken from a few places that I cannot remember, I am sorry.

# Requirements

## Submodules

* Card-Art.git &rarr; large-art: Not needed unless you wish to redo the art assests

# Protocol:

## Handshake

### `self` &darr;
Sent when connected. Indicates the connected user's own id.
* `client` Connected user's client information.

### `getName` &darr;
Requests a name from the client.
* `msg` message to display, may indicate why last name was invalid.

### `name` &uarr;
Responds to the `getName` request.
* `name` the name the client wishes to use.

### `rooms` &darr;
Displays a list of rooms to the client.
* `rooms` list of room objects.

## Room Related

### `join` &uarr;
Request to the server to join the specified room
* `room` Id of the room the user wishes to join

### `join` &darr;
Indicate a user is joining a room
* `client` User object for the user who is joining
* `room` Room object that the user is joining

### `clients` &darr;
Lists the users inside a room. Sent to a client when they join a room.
* `clients` List of users inside the Room
* `room` Room the users are in

### `leave` &darr;
Indicate a user is leaving a room.
* `client` User object for the user who is leaving
* `room` Room object that the user is leaving

## `owner` &darr;
Indicate a change of room ownership
* `owner` User object of the new owner
* `room` Room object the change corresponds to

## `chat` &uarr;
Sends a chat message to the room
* `msg` Chat message being Sent

## `chat` &darr;
Indicates a chat message has been received
* `msg` Chat message that was received
* `client` User object of whom sent the chat

## Game Related

### `cardList` &darr;
Lists the cards that will be used in the game
* `cardList` The list of cards
* `room` The current room

### `gridState` &darr;
The grid as it currently stands
* `grid` An array of card id's and their position in the grid

### `playCards` &uarr;
Cards the client is playing
* `cards` list of the cards the client is playing, identified by id and position
* `triggeredCard` The id of the card who's effect is triggered
* `params` The paramaters for the triggered card's effect, see effects below.

## Misc & Debug

### reSyncGrid &uarr;
Requests the server to resend `gridState`

## Effects
### Draw
 1. `pony` or `ship` - The deck the card is to be drawn from.

### Copy
 1. The id of the pony card who's effect is being copied
 2. The first paramater for the copied effects
 3. Secon paramater ect...

### Swap
 1. The first card to be swapped
 2. The second card to be swapped
