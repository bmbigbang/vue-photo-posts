<template>
  <v-container text-center mt-6 pt-6 v-if="posts">
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7"
                                 color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!-- Explore posts button -->
    <v-layout class="mt-2 mb-3" row wrap v-uf="!loading">
      <v-flex xs12>
        <v-btn class="secondary" to="/posts" large dark>
          Explore Posts
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- Posts Carousel -->
    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length" v-bind="{ 'cycle': true }" interval="3000">
        <v-carousel-item v-for="post in posts" :key="post._id" :src="post.imageUrl"
                         @click.native="goToPost(post._id)" class="carousel-link">
<!--          <h1>{{ (function(){debugger;posts})() || "" }}</h1>-->
          <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'home',
    created() {
      this.handleGetCarouselPosts();
    },
    computed: {
      ...mapGetters(['loading', 'posts'])
    },
    methods: {
      handleGetCarouselPosts() {
        // fire get posts action within VueX, relaying the state management.
        this.$store.dispatch('getPosts');
      },
      goToPost(postId) {
        this.$router.push(`/posts/${postId}`);
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

  .carousel-link {
    cursor: pointer;
  }
</style>
