<template>
  <v-app>
    <v-card>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <h1 style="text-align: center;">Sign In</h1>
          <v-card color="secondary" dark>
            <v-container>
              <v-form @submit.prevent="handleSignInUser">

                <v-layout row>
                  <v-flex ml-4 mr-4>
                    <v-text-field v-model="username" prepend-icon="face" label="Username" type="text"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex ml-4 mr-4>
                    <v-text-field v-model="password" prepend-icon="extension" label="password" type="password"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex>
                    <v-card-actions class="justify-center">
                      <v-btn accent type="submit">Sign In</v-btn>
                    </v-card-actions>
                    <div style="text-align: center;">
                      <h3>Don't have an account?
                        <router-link to="/signup">
                          <span class="link--text">Sign Up</span>
                        </router-link>
                      </h3>
                    </div>
                  </v-flex>
                </v-layout>

              </v-form>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: "signIn",
    data() {
      return {
        username: '',
        password: ''
      };
    },
    computed: {
      ...mapGetters(['user'])
    },
    watch: {
      user(value) {
        if (value) {
          this.$router.push('/');
        }
      }
    },
    methods: {
      handleSignInUser() {
        this.$store.dispatch('signInUser', {
          username: this.username,
          password: this.password
        });
      }
    }
  }
</script>
