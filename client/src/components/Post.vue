<template>
  <v-container v-if="getPost" mt-6 pt-6 flexbox center>
    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn @click="handleLikePost" large icon v-if="user">
              <v-icon :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'"
                      large>favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{ getPost.likes }} Likes</h3>

            <v-spacer></v-spacer>

            <v-icon color="info" large
                    @click="goToPreviousPage">
              arrow_back
            </v-icon>
          </v-card-title>

          <v-tooltip right>
            <template v-slot:activator="{ on: tooltip }">
              <span>Click to enlarge image</span>
              <v-img :src="getPost.imageUrl"
                     id="post__image" @click="toggleImageDialog"></v-img>
            </template>
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
            <h3>{{ getPost.description }}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Messages Section -->
    <div class="mt-3">
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form :rules="messageRules" v-model="isFormValid" lazy-validation ref="form"
                  @submit.prevent="handleAddPostMessage">
            <v-layout row>
              <v-flex xs12>
                <v-text-field v-model="messageBody" clearable
                              :append-outer-icon="messageBody && 'send'"
                              prepend-icon="email" label="Add Message"
                              type="text" required
                              @click:append-outer="handleAddPostMessage">

                </v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Messages ({{ getPost.messages.length }})</v-subheader>

            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>
              <v-list-item inset :key="message.title">
                <v-list-item-avatar>
                  <img :src="message.messageUser.avatar">
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ message.messageBody }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ message.messageUser.username }}
                    <span class="grey--text text--lighten-1 hidden-xs-only">
                      {{ message.messageDate }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action class="hidden-xs-only">
                  <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">
                    chat_bubble
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </div>

  </v-container>
</template>

<script>
  import {GET_POST, ADD_POST_MESSAGE, LIKE_POST, UNLIKE_POST} from '../queries'
  import { mapGetters } from 'vuex'

  export default {
    name: "post",
    props: ['postId'],
    data() {
      return {
        dialog: false,
        postLiked: false,
        messageBody: '',
        isFormValid: true,
        messageRules: [
          message => !!message || 'Message is required',
          message => message.length < 70 || 'Message must be less than 70 characters'
        ]
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
      ...mapGetters(['user', 'userFavorites'])
    },
    methods: {
      goToPreviousPage() {
        this.$router.go(-1);
      },
      toggleImageDialog() {
        if (window.innerWidth > 500) {
          this.dialog = !this.dialog;
        }
      },
      checkIfOwnMessage(message) {
        return this.user && (this.user._id === message.messageUser._id)
      },
      checkIfPostLiked(postId) {
        if (this.userFavorites.find((fave) => fave._id === postId)) {
          this.postLiked = true;
          return true;
        }
        else {
          this.postLiked = false;
          return false;
        }
      },
      handleLikePost() {
        const variables = {
          postId: this.postId,
          username: this.user.username
        };
        this.$apollo.mutate({
          mutation: (this.postLiked === true) ? UNLIKE_POST : LIKE_POST,
          variables,
          update: (cache, { data: { Post } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            if (this.postLiked === true) data.getPost.likes -= 1;
            else data.getPost.likes += 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            })
          }
        }).then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data[(this.postLiked === true) ? "unlikePost" : "likePost"].favorites
          };
          this.$store.commit('setUser', updatedUser);
        }).catch(err => console.error(err));
      },
      handleAddPostMessage() {
        if (!this.$refs.form.validate()) return;
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        };
        this.$apollo.mutate({
          mutation: ADD_POST_MESSAGE,
          variables,
          update: (cache, { data: { addPostMessage } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.messages.unshift(addPostMessage);
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        }).then(({ data }) => {
          this.$refs.form.reset();
        }).catch(err => console.error(err))
      }
    }
  }
</script>

<style scoped>
#post__image {
  height: 400px;
}
</style>