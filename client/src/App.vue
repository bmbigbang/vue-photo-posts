<template>
  <v-app>
    <v-toolbar fixed color="primary" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          Vue Photo Posts
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-title tag="span">Search</v-toolbar-title>
      <v-text-field flex placeholder="Search posts" style="margin-left: 12px"
                    color="accent" single-line hide-details></v-text-field>
    </v-toolbar>
    <main>
      <router-view/>
    </main>
  </v-app>
</template>
