# zap-js
Tiny client-side router for javascript.

## Routing

It's quite basic

Add zap to \<body>
```html
  <script src="/path/to/zap.js"></script>
```
### Adding routes

Static routes
```javascript
var $router = new Zap()

$router.on('/', function (params) {

    console.log('We are home')
})

$router.on('/book/45' function (params) {

    console.log('I want to read book 45')
})
```


Dynamic routes

```javascript
var $router = new Zap()

$router.on('/book/:id' function (id, params) {

    console.log('I want to read book with id ', id)
})

$router.on('/book/:id/:author', function (id, author, params) {

    console.log('I want to read a book which id is ' + id + ' and author is ' + author)
})
```

### Routing with query strings

You can as well get the value of query strings from routes

eg. We have a url like
```
http://example.com/book/?id=45&author=dammy
```

We can write our route like
```javascript
$router.on('/book', function (params) {

    console.log('I want to read a book which id is ' + params.id + ' and author is' + params.author)
})
```

Let the router listen to routes

After you have added all routes, you'll have to trigger router to listen to routes
```javascript
$router.$trigger()
```

La fin!
