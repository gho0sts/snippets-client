import { localUrls } from './app-data/urls';

import AccountPage from './components/account/containers/AccountPage.vue';
import AccountCreatePage from './components/account/containers/AccountCreatePage.vue';
import LoginPage from './components/account/containers/LoginPage.vue';
import SnippetCreatePage from './components/snippets/containers/SnippetCreatePage.vue';
import SnippetDetailPage from './components/snippets/containers/SnippetDetailPage.vue';
import SnippetsListPage from './components/snippets/containers/SnippetsListPage.vue';
import TagsListPage from './components/snippets/containers/TagsListPage.vue';


export const routes = [
  { path: '/', redirect: { name: 'snippets-list' } },

  /*=============================================
   = Auth routes
   =============================================*/
  {
    path: localUrls.login,
    component: LoginPage,
    name: 'login'
  },
  {
    path: localUrls.account,
    component: AccountPage,
    name: 'account'
  },
  {
    path: localUrls.accountCreate,
    component: AccountCreatePage,
    name: 'account-create'
  },

  /*=============================================
   = Snippets routes
   =============================================*/
  {
    path: localUrls.snippetsList,
    component: SnippetsListPage,
    name: 'snippets-list'
  },
  {
    path: localUrls.snippetsFilteredList,
    component: SnippetsListPage,
    name: 'snippets-filtered-list'
  },
  {
    path: localUrls.snippetCreate,
    component: SnippetCreatePage,
    name: 'snippet-create'
  },
  {
    path: localUrls.snippetDetail,
    component: SnippetDetailPage,
    name: 'snippet-detail'
  },

  /*=============================================
   = Tags routes
   =============================================*/
  {
    path: localUrls.tagsList,
    component: TagsListPage,
    name: 'tags-list'
  },

  // catch-all redirect to home page
  { path: '*', redirect: { name: 'snippets-list' } },
];
