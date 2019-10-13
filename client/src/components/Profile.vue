<template>
  <v-container text-xs-center mt-6 pt-6>
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout row wrap>
          <v-flex xs5>
            <v-img height="125px" contain :src="user.avatar" id="user-avatar"></v-img>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div class="headline">{{ user.username }}</div>
            </v-card-title>
            <div>
              <div>Joined {{ user.joinDate }}</div>
              <div class="hidden-xs-only font-weight-thin">{{ user.favorites.length }} Favorites</div>
              <div class="hidden-xs-only font-weight-thin">{{ userPosts.length }} Posts Added</div>
              <br/>
            </div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <v-container v-if="!userFavorites.length">
      <v-layout row wrap text-center>
        <v-flex xs12>
          <h2>You have no favorites currently.</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12 text-center>
        <h2 class="font-weight-light">
          Favorites
          <span class="font-weight-regular">{{ userFavorites.length }}</span>
        </h2>
      </v-flex>
      <v-layout row wrap text-center>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img height="30vh" :src="favorite.imageUrl"></v-img>
            <v-card-text>{{ favorite.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Posts created by  user -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You haven't posted anything yet.</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light text-center">
          Your Posts
          <span class="font-weight-regular">{{ userPosts.length }}</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2 text-center" hover>
            <v-btn
                @click="loadPost(post)"
                class="post-buttons" color="info"
                floating small dark>
              <v-icon>edit</v-icon>
            </v-btn>

            <v-btn
                class="post-buttons" color="error" floating small dark
                @click="handleDeleteUserPost(post)">
              <v-icon>delete</v-icon>
            </v-btn>

            <v-img height="30vh" :src="post.imageUrl"></v-img>
            <v-card-text>{{ post.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit post dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Update Post
        </v-card-title>

        <v-container>
          <v-form v-model="isFormValid" lazy-validation ref="form"
                  @submit.prevent="handleUpdateUserPost">

            <!-- Title input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="titleRules" v-model="title"
                              label="Post Title" type="text"
                              required></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image url input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="imageRules" v-model="imageUrl"
                              label="Image URL" type="text"
                              required></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image preview -->
            <v-layout row>
              <v-flex xs12>
                <img :src="imageUrl" height="300px" alt="Image preview">
              </v-flex>
            </v-layout>

            <!-- Categories selector -->
            <v-layout row>
              <v-flex xs12>
                <v-select v-model="categories" :rules="categoriesRules" :items="['Art', 'Education', 'Food',
                  'Furniture', 'Travel', 'Photography', 'Animals', 'Icons']" multiple label="Categories">
                </v-select>
              </v-flex>
            </v-layout>

            <!-- Description Text Area -->
            <v-layout row>
              <v-flex xs12>
                <v-textarea :rules="descRules" v-model="description"
                            label="Description" type="text"
                            required></v-textarea>
              </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  :disabled="!isFormValid" type="submit" class="success--text"
                  text>
                Update
              </v-btn>
              <v-btn class="error-text" text @click="editPostDialog = false">Cancel</v-btn>

            </v-card-actions>

          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "profile",
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: '',
      imageUrl: '',
      categories: [],
      description: '',
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 20 || "Title must have less than 20 characters"
      ],
      imageRules: [
        image => !!image || "Image is required"
      ],
      categoriesRules: [
        categories => categories.length >= 1 || "At least one category is required"
      ],
      descRules: [
        desc => !!desc || "Description is required",
        desc => desc.length < 200 || "Description must have less than 200 characters"
      ]
    }
  },
  computed: {
    ...mapGetters(['user', 'userFavorites', 'userPosts'])
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    handleGetUserPosts() {
      this.$store.dispatch('getUserPosts', {
        userId: this.user._id
      });
    },
    handleUpdateUserPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('updateUserPost', {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        });
        setTimeout(() => {
          this.editPostDialog = false;
        }, 120)
      }
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false);
      const deletePost = window.confirm('Are you sure you want to delete this post?');
      if (deletePost) {
        this.$store.dispatch('deleteUserPost', {
          postId: this.postId
        });
      }
    },
    loadPost({ _id, title, imageUrl, categories, description }, editPostDialog = true) {
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    }
  }
}
</script>

<style>
#user-avatar {
  margin-top: 20px;
}

.post-buttons {
  margin: 3px 5px 3px 5px
}
</style>
