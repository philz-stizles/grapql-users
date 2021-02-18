const graphql = require('graphql');
const _ = require('lodash'); // Helps us walk through collections of data
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const users = [
    {id: "23", "companyId": "1", firstName: "theo", "age": 21},
    {id: "200", "companyId": "2", firstName: "steven", "age": 28},
    {id: "13", "companyId": "3", firstName: "dika", "age": 18},
    {id: "10", "companyId": "2", firstName: "dan", "age": 24},
    {id: "1", "companyId": "3", firstName: "dika", "age": 38},
    {id: "12", "companyId": "1", firstName: "dan", "age": 29}
];


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: { 
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return _.find(users, { id: args.id });
            }
        },
        users: { 
            type: UserType,
            resolve(parentValue, args) {
                return _.find(users);
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})