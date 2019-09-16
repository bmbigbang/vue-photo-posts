<template>
  <v-app>
    <v-card>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <h1 style="text-align: center;">Sign Up</h1>
          <!-- Error Alert -->
          <v-card v-if="error" color="secondary" dark>
            <form-alert :message="error.message"></form-alert>
          </v-card>
        </v-flex>
      </v-layout>

      <!-- Sign up form -->
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-card color="secondary" dark>
            <v-container>
              <v-form v-model="isFormValid" lazy-validation ref="form"
                      @submit.prevent="handleSignUpUser">

                <v-layout row>
                  <v-flex ml-4 mr-4>
                    <v-text-field :rules="usernameRules" v-model="username"
                                  prepend-icon="face" label="Username" type="text"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex ml-4 mr-4>
                    <v-text-field :rules="emailRules" v-model="email"
                                  prepend-icon="email" label="eMail" type="email"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex ml-4 mr-4>
                    <v-text-field :rules="passwordRules" v-model="password"
                                  prepend-icon="extension" label="Password" type="password"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex ml-4 mr-4>
                    <v-text-field :rules="passwordRules" v-model="passwordConfirmation"
                                  prepend-icon="extension" label="Confirm Password" type="password"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex>
                    <v-card-actions class="justify-center">
                      <v-btn accent :loading="loading" :disabled="!isFormValid || loading" type="submit">
                        <template v-slot:loader>
                          <span class="custom-loader">
                            <v-icon light>cached</v-icon>
                          </span>
                        </template>
                        Sign Up</v-btn>
                    </v-card-actions>
                    <div style="text-align: center;">
                      <h3>Already have an account?
                        <router-link to="/signin">
                          <span class="link--text">Sign In</span>
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
import { mapGetters } from 'vuex';

export default {
  name: "signUp",
  data() {
    return {
      isFormValid: true,
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      usernameRules: [
        username => !!username || "Username is required",
        username => username.length <= 10 || "Username must be between 2 to 10 characters",
        username => username.length >= 2 || "Username must be between 2 to 10 characters"
      ],
      emailRules: [
        email => !!email || 'Email is required',
        email => /.@+./.test(email) || "Email must be valid"
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password => password.length >= 4 || 'Password must be at least 4 characters',
        confirmation => confirmation === this.password || 'Passwords must match'
      ]
    }
  },
  computed: {
    ...mapGetters(['loading', 'error', 'user'])
  },
  watch: {
    user(value) {
      if (value) {
        this.$router.push('/');
      }
    }
  },
  methods: {
    handleSignUpUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signUpUser', {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    }
  }
}
</script>
