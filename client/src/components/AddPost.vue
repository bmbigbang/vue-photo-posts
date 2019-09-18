<template>
  <v-container text-center mt-4 pt-4>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Add Post</h1>
      </v-flex>
    </v-layout>

    <!-- Sign up form -->

      <v-form v-model="isFormValid" lazy-validation ref="form"
              @submit.prevent="handleAddPost">

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

        <v-layout row>
          <v-flex>
            <v-card-actions class="justify-center">
              <v-btn color="info" :loading="loading" :disabled="!isFormValid || loading" type="submit">
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
                Submit</v-btn>
            </v-card-actions>

          </v-flex>
        </v-layout>

      </v-form>
  </v-container>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "addPost",
  data() {
    return {
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
    ...mapGetters(['loading', 'user'])
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addPost', {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });
        this.$router.push('/');
      }
    }
  }
}
</script>
