<template>
  <v-app>
    <h1>Home</h1>
    <div v-if="$apollo.loading">Loading...</div>
    <ul v-else v-for="post in getPosts" :key="post._id">
      <li>
        {{ post.title }}
        {{ post.imageUrl }}
        {{ post.description }}
      </li>
      <li>{{ post.likes }}</li>
    </ul>
<!--    <v-btn color="secondary">Button</v-btn>-->
  </v-app>
</template>

<script>
import { gql } from 'apollo-boost';

export default {
  name: 'home',
  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            description
            likes
          }
        }
      `
    }
  }
}
</script>
