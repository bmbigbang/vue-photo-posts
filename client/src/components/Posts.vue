<template>
  <v-container fluid text-xs-center grid-list-xl mt-4 pt-4>
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex xs12 sm6 v-for="post in infiniteScrollPosts.posts" :key="post._id">
        <v-card hover>
          <v-img :src="post.imageUrl" height="30vh" lazy></v-img>

          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{ post.title }}</div>
                <span class="grey--text">{{ post.likes }} likes - {{
                  post.messages.length }} comments</span>
              </div>
            </v-card-title>

            <v-spacer></v-spacer>

            <v-btn @click="showPostCreator = showPostCreator === post._id ? '' : post._id" icon>
              <v-icon>{{ `keyboard_arrow${showPostCreator === post._id ? "_up" : "_down"}` }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-slide-y-transition>
            <v-card-text v-show="showPostCreator === post._id" class="grey lighten-4">
              <v-list-item avatar>
                <v-list-item-avatar>
                  <img :src="post.createdBy.avatar" alt="av">
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="text--primary">
                    {{ post.createdBy.username }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-weight-thin">
                    Added {{ post.createdDate }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout column>
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn @click="showMorePosts" v-if="showMoreEnabled">Fetch More</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
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
      showMoreEnabled: true,
      showPostCreator: ""
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
