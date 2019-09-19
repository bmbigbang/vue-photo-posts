<template>
<!--  <v-container text-center mt-4 pt-4>-->
<!--    <v-layout row wrap>-->
<!--      <v-flex xs12 sm6 offset-sm3>-->
<!--        <h1>Posts</h1>-->
<!--      </v-flex>-->
<!--    </v-layout>-->
<!--  </v-container>-->
  <v-container v-if="infiniteScrollPosts" text-center mt-4 pt-4>
    <div v-for="post in infiniteScrollPosts.posts" :key="post._id">
      <img :src="post.imageUrl" height="100px">
      <h3>{{ post.title }}</h3>
    </div>
    <v-btn @click="showMorePosts" v-if="showMoreEnabled">Fetch More</v-btn>
  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from "../queries";

const pageSize = 2;

export default {
  name: "posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true
    }
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    showMorePosts() {
      this.pageNum += 1;
      // fetch more data and transform the page with new results
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
          this.showMoreEnabled = hasMore;

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Merge new posts in
              posts: [
                ...prevResult.infiniteScrollPosts.posts,
                ...newPosts
              ],
              hasMore
            }
          }
        }
      })
    }
  }
}
</script>
