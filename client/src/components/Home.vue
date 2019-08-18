<template>
  <v-app v-if="getPosts">
    <v-flex xs12>
      <v-carousel v-bind="{ 'cycle': true }" interval="3000">
        <v-carousel-item v-for="post in getPosts" :key="post._id" :src="post.imageUrl">
<!--          <h1>{{ (function(){debugger;post})() || "" }}</h1>-->
          <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
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

<style>
  #carousel__title {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 5px 5px 0 0;
    padding: 0.5em;
    margin: 0 auto;
    bottom: 50px;
    left: 0;
    right: 0;
    text-align: center;
  }
</style>
