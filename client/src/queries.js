import { gql } from 'apollo-boost';

/* Post Queries */
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
      description
      likes
    }
  }
`;

/* User Queries */
export const GET_CURRENT_USER = gql`    
  query {
    getCurrentUser {
      _id
      username
      email
      password
      avatar
      joinDate
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

/* Post Mutations */

/* User Mutations */
export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signInUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SINGUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signUpUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
