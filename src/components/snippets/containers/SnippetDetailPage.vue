<template>
  <section>
    <h3 class="page-title">
      {{ originalSnippet.title }}
      <i
        v-if="working"
        class="fa fa-cog fa-spin"
        aria-hidden="true">
      </i>
    </h3>

    <el-card class="box-card">
      <div class="text item">

        <!-- error message display -->
        <el-alert
          title="Snippet Creation Error"
          type="error"
          v-if="apiError"
          :description="apiError"
          :closable="false">
        </el-alert>

        <!-- snippet form -->
        <app-snippet-form
          submitText="Save"
          cancelText="Back"
          :working="working"
          :snippet="snippet"
          @submitted="onFormSubmitted"
          @cancelled="onFormCancelled">
        </app-snippet-form>

      </div><!-- /.text item -->
    </el-card>

  </section>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex';

  import { localUrls } from '../../../app-data/urls';
  import errors from '../../../app-data/errors';
  import snippetData from '../helpers/snippetData';
  import snippetStyles from '../helpers/snippetStyles';
  import SnippetForm from '../components/forms/SnippetForm.vue';

  export default {
    components: {
      appSnippetForm: SnippetForm
    },


    data() {
      return {
        // whether any operations are currently running
        working: false,

        // whether the Snippet data is currently being refreshed
        refreshing: false,

        // error messages returned from API (e.g. invalid data)
        apiError: '',

        // the working copy of the Snippet
        snippet: {},

        // a copy of the Snippet, used for checking for changes
        originalSnippet: {},
      };
    },


    methods: {
      /**
       * Attempts to submit the current user data to the API to login.
       */
      onFormSubmitted(value, event) {
        const msgNotify = {
          type: 'info',
          title: 'Cannot Update',
          message: 'No changes to save.'
        };

        const updatedSnippet = snippetData.buildRecordData(this.snippet);
        updatedSnippet.title = value.title.trim() || snippetData.DEFAULT_TITLE;
        updatedSnippet.url = value.url.trim();

        if (updatedSnippet.title === this.originalSnippet.title &&
            updatedSnippet.url === this.originalSnippet.url) {
          // if the Snippet has not changed, show a message and do not submit the update
          this.$notify(msgNotify);
        } else {
          // otherwise, submit the update to the API
          this.working = true;
          this.apiError = '';

          this.updateSnippet({ snippet: updatedSnippet })
            .then(() => {
              this.$router.push(localUrls.snippetsList);
              this.working = false;
            }, (err) => {
              this.apiError = err;
              this.working = false;
            });
        }
      },

      onFormCancelled(value, event) {
        this.$router.go(-1);
      },

      ...mapActions([
        'checkForStoredLogin',
        'findSnippet',
        'updateSnippet',
      ])
    },


    /*
     * Search in route params for a Snippet ID. If none is found, redirect
     * to List page. If it is found, use it. Otherwise, redirect to List page.
     */
    created() {
      this.working = true;
      this.refreshing = true;
      this.checkForStoredLogin()
        .then((res) => {
          const snippetId = this.$route.params.id;
          if (!snippetId) {
            this.$router.push(localUrls.snippetsList);
          } else {
            this.findSnippet(snippetId)
              .then((res) => {
                // if we get a valid Snippet, save two local copies
                this.snippet = Object.assign({}, res);
                this.originalSnippet = Object.assign({}, res);
                this.working = false;
                this.refreshing = false;
              }, (err) => {
                // if no valid Snippet, return to the List view
                this.$notify({
                  message: 'Invalid Snippet ID',
                  type: 'info'
                });
                this.working = false;
                this.refreshing = false;
                this.$router.push(localUrls.snippetsList);
              });
          }
        }, (err) => {
          // token error; logout and redirect to login page
          if (err === errors.INVALID_TOKEN) {
            this.$notify({
              title: 'Invalid auth token',
              message: 'Please login again.',
              type: 'warning'
            });
          }
          this.$router.push(localUrls.login);
          this.working = false;
          this.refreshing = false;
        });
    }
  };
</script>
