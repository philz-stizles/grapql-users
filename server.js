// https://github.com/StephenGrider/GraphQLCasts
// npm install express graphql express-graphql lodash 
// npm install --save-dev json-server concurrently
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// Connect to GraphQL
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const PORT = process.env.PORT || 4000;

app.listen(PORT, err => {
    console.log(`Server started on port ${PORT}`)
})