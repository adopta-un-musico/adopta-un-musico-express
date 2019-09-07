# Adopta un músico

## Description

An app that helps musicians to find bands to join in, and bands to find musicians for permanent or special occasions.

## User Stories

- As a user I can see a homepage that allows me to sign up and log in
- As a user I can sign up on the website
- As a user I can log in on the website
- As a user I can see my profile
- As a user I can update my profile
- As a user I can search for other musicians
- As a user I can search for bands
- As a user I can see the public profiles of musicians
- As a user I can see the public profiles of bands
- As a user I can leave a message in other profiles to share contact details

## Backlog

- Calendar with next events on the user profile
- Search for musicians/bands around you
- New user local who is able to create events for the bands to join
- Connect to Spotify API for : - Get all music genres - Music Demo on bands profiles
- Chat between users
- Show a map with future places where you will be (performing, practicing, teaching...)
- Order musical styles and instruments by importance

## Routes

| Name                 | Method | Endpoint     | Description                                         | Body                          | Redirect |
| -------------------- | ------ | ------------ | --------------------------------------------------- | ----------------------------- | -------- |
| Home (not logged in) | GET    | /            | Show home page with signup/login options            |                               |
| Home (logged in)     | GET    | /            | Show welcome page with options                      |                               |
| Log in form          | GET    | /login       | Show form to log in                                 |                               |
| Log in               | POST   | /login       | Allow user to log in                                | {email, password}             | /        |
| Sign up form         | GET    | /signup      | Show form to sign up                                |                               |
| Sign up              | POST   | /signup      | Allow user to sign up                               | {email, password, instrument} | /        |
| Search for           | GET    | /search      | Show search bar                                     |                               |
| Results              | GET    | /results     | Show search results                                 |                               |
| Other user's profile | GET    | /:id         | Show other users profile                            |                               |
| Contact other user   | GET    | /:id/contact | Show form to leave message to other user            |                               |
| Contact              | POST   | /:id/contact | Allow user to leave message to other user's profile | {message}                     | /:id     |

falta:

perfil (ver y actualizar)
perfil banda (ver y actualizar)
borrar banda

## Models

#### Musician model

```Javascript
{
	email: string,
	password: string,
	musical genres: array string,
	instruments: array string,
	location: string,
	nickname: string (not necessarily unique),
	timestamps: {
		created at: time,
		updated at: time
	}
}
```

#### Band model

```Javascript
{
	username: string,
	password: string,
	manager: ObjectID<musician>,
	bandname: string,
	musical genres: array string,
	members: [ObjectID<musician>],
	location: string,
	timestamps: {
		created at: time,
		updated at: time
	}
}
```

#### Message model

```Javascript
{
	giver: ObjectID<musician>,
	receiver: ObjectID<musician>,
	message: string (limit 140 characters),
	timestamps: {
			created at: time,
			updated at: time
	}
}
```

We should relate them by IDs.

## Links

### Git

[Link Repo]()
[Link Deploy]()

### Slides

[Link Slides.com]()
