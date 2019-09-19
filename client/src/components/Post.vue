<template>
  <v-container v-if="getPost" mt-6 pt-6 flexbox center>
    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn large icon v-if="user">
              <v-icon large color="grey">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{ getPost.likes }} Likes</h3>

            <v-spacer></v-spacer>

            <v-icon color="info" large
                    @click="goToPreviousPage">
              arrow_back
            </v-icon>
          </v-card-title>

          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-img slot="activator" :src="getPost.imageUrl"
                   id="post__image" @click="toggleImageDialog"></v-img>
          </v-tooltip>

          <!-- Large post image dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="500px"></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">
                {{ category }}
              </v-chip>
            </span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { GET_POST } from '../queries'
  import { mapGetters } from 'vuex'

  export default {
    name: "post",
    props: ['postId'],
    data() {
      return {
        dialog: false
      }
    },
    apollo: {
      getPost: {
        query: GET_POST,
        variables() {
          return {
            postId: this.postId
          }
        }
      }
    },
    computed: {
      ...mapGetters(['user'])
    },
    methods: {
      goToPreviousPage() {
        this.$router.go(-1);
      },
      toggleImageDialog() {
        if (window.innerWidth > 500) {
          this.dialog = !this.dialog;
        }
      }
    }
  }
</script>

<style scoped>
#post__image {
  height: 400px;
}
</style>