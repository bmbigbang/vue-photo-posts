<template>
  <v-app light>
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">Vue Photo Posts</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list>
        <v-list-item ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ item.title }}
          </v-list-item-content>
        </v-list-item>

        <!-- Sign Out Button -->
        <v-list-item v-if="user" @click="handleSignOutUser">
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>Sign Out</v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-app-bar fixed color="primary" dark>
      <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
      <v-toolbar-title class="title hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          Vue Photo Posts
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-title tag="span">Search</v-toolbar-title>
      <v-text-field v-model="searchTerm" @input="handleSearchPosts"
        flex prepend-icon="search" placeholder="Search posts"
        style="margin-left: 12px" color="accent"
        single-line hide-details></v-text-field>

      <!-- Search results card -->
      <v-card dark v-if="searchResults.length" id="search__card">
        <v-list>
          <v-list-item
              v-for="result in searchResults" :key="result._id"
              @click="goToSearchResult(result._id)">
            <v-list-item-title>
              {{ result.title }}
              <span class="font-weight-thin">{{ formatDesc(result.description) }}</span>
            </v-list-item-title>

            <v-list-item-action v-if="checkIfUserFav(result._id)">
              <v-icon>favorite</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn color="primary" v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon class="hidden-sm-only" left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <!-- Profile Button -->
        <v-btn color="primary" to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge right color="blue darken-2" :class="{ 'bounce': badgeAnimated }">
            <span slot="badge" v-if="userFavorites.length">{{ userFavorites.length }}</span>
            Profile
          </v-badge>
        </v-btn>

        <!-- Sign Out Button -->
        <v-btn color="primary" v-if="user" @click="handleSignOutUser">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          Sign Out
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <v-container fluid class="mt-4">
        <transition name="fade">
          <router-view/>
        </transition>
      </v-container>

      <!-- Auth Snackbar -->
      <v-snackbar v-model="authSnackbar" color="success" :timeout="5000" bottom left>
        <v-icon class="mr-3">check_circle</v-icon>
        <h3>You are now signed in!</h3>
        <v-btn dark text @click="authSnackbar = false">Close</v-btn>
      </v-snackbar>

      <!-- Auth Error Snackbar -->
      <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="error" :timeout="10000" bottom left>
        <v-icon class="mr-3">cancel</v-icon>
        <h3>{{ authError.message }}</h3>
        <v-btn dark text to="/signin">Sign In</v-btn>
      </v-snackbar>

    </v-content>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'App',
    data() {
      return {
        searchTerm: '',
        sideNav: false,
        authSnackbar: false,
        authErrorSnackbar: false,
        extensionHeight: 80
      };
    },
    watch: {
      user(oldValue) {
        // only show snackbar if previous value for user was null
        if (oldValue) {
          this.authSnackbar = true;
        }
      },
      authError(value) {
        if (value) {
          this.authErrorSnackbar = true;
        }
      },
      userFavorites(oldValue, newValue) {
        if (!oldValue || !newValue || oldValue.length !== newValue.length) {
          this.badgeAnimated = true;
          setTimeout(() => (this.badgeAnimated = false), 1000);
        }
      }
    },
    computed: {
      ...mapGetters(["authError", 'user', 'userFavorites', 'searchResults']),
      horizontalNavItems() {
        let navButtons;
        if (this.user) {
          navButtons = [
            { icon: 'chat', title: 'Posts', link: '/posts' }
          ];
        } else {
          navButtons = [
            { icon: 'chat', title: 'Posts', link: '/posts' },
            { icon: 'lock_open', title: 'Sign In', link: '/signin' },
            { icon: 'create', title: 'Sign Up', link: '/signup'}
          ];
        }
        return navButtons;
      },
      sideNavItems() {
        let sideNavButtons;
        if (this.user) {
          sideNavButtons = [
            { icon: 'chat', title: 'Posts', link: '/posts' },
            { icon: 'stars', title: 'Create Post', link: '/post/add' },
            { icon: 'account_box', title: 'Profile', link: '/profile' }
          ]
        } else {
          sideNavButtons = [
            { icon: 'chat', title: 'Posts', link: '/posts' },
            { icon: 'lock_open', title: 'Sign In', link: '/signin' },
            { icon: 'create', title: 'Sign Up', link: '/signup'}
          ]
        }
        return sideNavButtons;
      }
    },
    methods: {
      handleSignOutUser() {
        this.$store.dispatch('signOutUser');
      },
      toggleSideNav() {
        this.sideNav = !this.sideNav;
      },
      goToSearchResult(resultId) {
        this.searchTerm = '';
        this.$store.commit('clearSearchResults');
        this.$router.push(`/posts/${resultId}`);
      },
      formatDesc(desc) {
        if (desc.length > 30) return desc.slice(0, 30) + "...";
      },
      checkIfUserFav(resultId) {
        return this.userFavorites && this.userFavorites.some(fave => fave._id === resultId);
      },
      handleSearchPosts() {
        this.$store.dispatch('searchPosts', {
          searchTerm: this.searchTerm
        });
      }
    }
  }
</script>

<style>

  h1 {
    font-weight: 400;
    font-size: 2.5rem;
  }

  h2 {
    font-weight: 400;
    font-size: 2rem;
  }

  .fade-enter-active, .fade-leave-active {
    transition-property: all;
    transition-duration: 0.25s;
  }

  .fade-enter-active {
    transition-delay: 0.25s
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
    transform: translateY(-25px);
  }

  /* User Favorite Animation */
  .bounce {
    animation: bounce 1s both;
  }

  /* Search results card */
  #search__card {
    position: absolute;
    width: 60vw;
    left: 20%;
    z-index: 8;
    top: 100%;
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0, 0, 0);
    }

    40%, 43% {
      transform: translate3d(0, -20px, 0);
    }

    70% {
      transform: translate3d(0, -10px, 0);
    }

    90% {
      transform: translate3d(0, -4px, 0);
    }
  }
</style>