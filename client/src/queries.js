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

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMore
      posts {
        _id
        title
        imageUrl
        categories
        description
        likes
        createdDate
        messages {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
    }
  }
`;

/* Post Mutations */
export const ADD_POST = gql`
    mutation($title: String!, $imageUrl: String! $categories: [String]!,
        $description: String!, $creatorId: ID!) {
        addPost(title: $title, imageUrl: $imageUrl, categories: $categories,
            description: $description, createdById: $creatorId
        ) {
            _id
            title
            imageUrl
            categories
            description
        }
    }
`;

/* User Mutations */
export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signInUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signUpUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

