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
  data() {
    return {
      posts: []
    }
  },
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
      `,
      result(args) {
        if (!args.loading) {
          this.posts = args.data.getPosts;
          console.log("[networkStatus]", args.networkStatus)
        }
      },
      error(err) {
        console.error('[Error!!]', err);
        console.dir(err);
      }
    }
  }
}
</script>
