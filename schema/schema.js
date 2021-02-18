const graphql = require('graphql');
const axios = require('axios');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;

const baseUrl = 'http://localhost:3000';

// Very Important - Order of GraphQLObjectType definition matters
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: { 
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`${baseUrl}/companies/${parentValue.id}/users`)
                    .then(response => response.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => (
        {
            id: { type: GraphQLString },
            firstName: { type: GraphQLString },
            age: { type: GraphQLInt },
            company: { 
                type: CompanyType,
                resolve(parentValue, args) {
                    return axios.get(`${baseUrl}/companies/${parentValue.companyId}`)
                        .then(response => response.data);
                }
            }
        }
    )
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: { 
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`${baseUrl}/users/${args.id}`)
                    .then(response => response.data);
            }
        },
        users: { 
            type: GraphQLList(UserType),
            // args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`${baseUrl}/users`)
                    .then(response => response.data);
            }
        },
        company: { 
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`${baseUrl}/companies/${args.id}`)
                    .then(response => response.data);
            }
        },
        companies: { 
            type: GraphQLList(CompanyType),
            // args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`${baseUrl}/companies`)
                    .then(response => response.data);
            }
        },
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: { 
            type: UserType, // What gets return from the Mutation
            args: { // Arguments passed into the Mutation
                firstName: { type: new GraphQLNonNull(GraphQLString )},
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return axios.post(`${baseUrl}/users`, { firstName: args.firstName, age: args.age })
                    .then(response => response.data);
            }
        },
        updateUser: {  
            type: UserType, // What gets return from the Mutation
            args: { 
                id: { type: new GraphQLNonNull(GraphQLString) }, 
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return axios.patch(`${baseUrl}/users/${args.id}`, args)
                    .then(response => response.data);
            }
        },
        deleteUser: { 
            type: UserType, // What gets return from the Mutation
            args: { 
                id: { type: new GraphQLNonNull(GraphQLString) } // Enforce id must be past as argument even if its not a valid id
            },
            resolve(parentValue, args) {
                return axios.delete(`${baseUrl}/users/${args.id}`)
                    .then(response => response.data);
            }
        },
        createCompany: { 
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`${baseUrl}/companies/${args.id}`)
                    .then(response => response.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
})